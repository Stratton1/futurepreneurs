import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * POST /api/admin/seed
 * Seeds the database with sample users, projects, and milestones.
 * Only works in development / when ALLOW_SEED=true.
 */
export async function POST() {
  try {
    const supabase = createAdminClient();

    // ── 0. Seed schools if they don't exist ──
    const schoolsToSeed = [
      { name: 'Riverside Academy', email_domain: 'riverside.sch.uk', city: 'London', county: 'Greater London' },
      { name: 'Oakwood High School', email_domain: 'oakwood.sch.uk', city: 'Manchester', county: 'Greater Manchester' },
      { name: "St Mary's School", email_domain: 'stmarys.ac.uk', city: 'Birmingham', county: 'West Midlands' },
      { name: 'Greenfield Comprehensive', email_domain: 'greenfield.sch.uk', city: 'Leeds', county: 'West Yorkshire' },
      { name: 'The Bridge School', email_domain: 'bridgeschool.sch.uk', city: 'Bristol', county: 'Bristol' },
    ];

    for (const school of schoolsToSeed) {
      const { data: existing } = await supabase
        .from('schools')
        .select('id')
        .eq('name', school.name)
        .maybeSingle();

      if (!existing) {
        await supabase.from('schools').insert(school);
      }
    }

    // ── 1. Fetch existing schools ──
    const { data: schools } = await supabase.from('schools').select('id, name, email_domain');
    if (!schools || schools.length < 3) {
      return NextResponse.json({ error: 'School seeding failed — not enough schools found' }, { status: 500 });
    }

    const schoolMap: Record<string, { id: string; domain: string }> = {};
    for (const s of schools) {
      schoolMap[s.name] = { id: s.id, domain: s.email_domain };
    }

    // Helper: create auth user + profile
    async function createUser(
      email: string,
      name: string,
      role: 'student' | 'teacher' | 'parent' | 'investor',
      schoolId?: string,
      parentId?: string
    ) {
      // Check if user already exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existingProfile) {
        return existingProfile.id;
      }

      // Create auth user
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: 'SeedPassword123!',
        email_confirm: true,
      });

      if (authError) {
        console.error(`Error creating auth user ${email}:`, authError);
        throw authError;
      }

      // Create profile
      const { error: profileError } = await supabase.from('user_profiles').insert({
        id: authUser.user.id,
        email,
        full_name: name,
        role,
        school_id: schoolId || null,
        is_verified: true,
        is_active: true,
        parent_id: parentId || null,
      });

      if (profileError) {
        console.error(`Error creating profile for ${email}:`, profileError);
        throw profileError;
      }

      return authUser.user.id;
    }

    // ── 2. Create Teachers ──
    const riverside = schoolMap['Riverside Academy'];
    const oakwood = schoolMap['Oakwood High School'];
    const stmarys = schoolMap["St Mary's School"];

    const teacherMsClark = await createUser(
      `ms.clark@${riverside.domain}`, 'Ms. Sarah Clark', 'teacher', riverside.id
    );
    const teacherMrPatel = await createUser(
      `mr.patel@${oakwood.domain}`, 'Mr. Raj Patel', 'teacher', oakwood.id
    );
    const teacherMrsJones = await createUser(
      `mrs.jones@${stmarys.domain}`, 'Mrs. Helen Jones', 'teacher', stmarys.id
    );

    // ── 3. Create Parents ──
    const parentDavies = await createUser('sarah.davies@gmail.com', 'Sarah Davies', 'parent');
    const parentWilson = await createUser('james.wilson@outlook.com', 'James Wilson', 'parent');
    const parentBrown = await createUser('lisa.brown@yahoo.co.uk', 'Lisa Brown', 'parent');
    const parentAhmed = await createUser('amira.ahmed@gmail.com', 'Amira Ahmed', 'parent');
    const parentTaylor = await createUser('david.taylor@gmail.com', 'David Taylor', 'parent');
    const parentGreen = await createUser('rachel.green@outlook.com', 'Rachel Green', 'parent');

    // ── 4. Create Students (linked to parents and schools) ──
    const studentOliver = await createUser(
      `oliver.d@${riverside.domain}`, 'Oliver D.', 'student', riverside.id, parentDavies
    );
    const studentZara = await createUser(
      `zara.w@${riverside.domain}`, 'Zara W.', 'student', riverside.id, parentWilson
    );
    const studentFinn = await createUser(
      `finn.b@${oakwood.domain}`, 'Finn B.', 'student', oakwood.id, parentBrown
    );
    const studentAmara = await createUser(
      `amara.a@${oakwood.domain}`, 'Amara A.', 'student', oakwood.id, parentAhmed
    );
    const studentJake = await createUser(
      `jake.t@${stmarys.domain}`, 'Jake T.', 'student', stmarys.id, parentTaylor
    );
    const studentLily = await createUser(
      `lily.g@${stmarys.domain}`, 'Lily G.', 'student', stmarys.id, parentGreen
    );

    // ── 5. Create an investor/backer ──
    await createUser('mark.investor@gmail.com', 'Mark Thompson', 'investor');

    // ── Additional schools for new students ──
    // Re-fetch schools to pick up any newly inserted ones
    const { data: allSchools } = await supabase.from('schools').select('id, name, email_domain');
    if (allSchools) {
      for (const s of allSchools) {
        schoolMap[s.name] = { id: s.id, domain: s.email_domain };
      }
    }

    const greenfield = schoolMap['Greenfield Comprehensive'];
    const bridge = schoolMap['The Bridge School'];

    // Create additional users only if schools exist
    let studentElla: string | undefined;
    let studentRyan: string | undefined;
    let studentMia: string | undefined;
    let teacherMrWilliams: string | undefined;
    let teacherMsDiaz: string | undefined;
    let parentMorris: string | undefined;
    let parentKhan: string | undefined;
    let parentEvans: string | undefined;

    if (greenfield && bridge) {
      parentMorris = await createUser('karen.morris@gmail.com', 'Karen Morris', 'parent');
      parentKhan = await createUser('hassan.khan@outlook.com', 'Hassan Khan', 'parent');
      parentEvans = await createUser('claire.evans@yahoo.co.uk', 'Claire Evans', 'parent');

      studentElla = await createUser(
        `ella.m@${greenfield.domain}`, 'Ella M.', 'student', greenfield.id, parentMorris
      );
      studentRyan = await createUser(
        `ryan.k@${greenfield.domain}`, 'Ryan K.', 'student', greenfield.id, parentKhan
      );
      studentMia = await createUser(
        `mia.e@${bridge.domain}`, 'Mia E.', 'student', bridge.id, parentEvans
      );

      teacherMrWilliams = await createUser(
        `mr.williams@${greenfield.domain}`, 'Mr. Tom Williams', 'teacher', greenfield.id
      );
      teacherMsDiaz = await createUser(
        `ms.diaz@${bridge.domain}`, 'Ms. Ana Diaz', 'teacher', bridge.id
      );
    }

    // ── 6. Create Projects ──
    const projectsData = [
      {
        student_id: studentOliver,
        mentor_id: teacherMsClark,
        title: 'Oliver\'s Cupcake Kitchen',
        description: 'I want to start a cupcake business selling to my local community. I have been baking for two years and my cupcakes always sell out at school fairs. I need funding to buy professional baking equipment, packaging, and ingredients to take orders online and deliver locally.',
        short_description: 'Homemade cupcakes for the community — professional equipment needed to scale up.',
        category: 'Food & Drink',
        goal_amount: 500,
        total_raised: 385,
        backer_count: 23,
        status: 'live',
        is_featured: true,
        images: [
          'https://picsum.photos/seed/cupcakes1/800/600',
          'https://picsum.photos/seed/cupcakes2/800/600',
          'https://picsum.photos/seed/cupcakes3/800/600',
        ],
        milestones: [
          { title: 'Buy baking equipment', description: 'Professional mixer, baking trays, and piping sets', amount: 200, sort_order: 1 },
          { title: 'Packaging and branding', description: 'Custom boxes, stickers, and business cards', amount: 150, sort_order: 2 },
          { title: 'First batch ingredients', description: 'Bulk flour, sugar, butter, and decorations', amount: 150, sort_order: 3 },
        ],
      },
      {
        student_id: studentZara,
        mentor_id: teacherMsClark,
        title: 'EcoThreads — Upcycled Fashion',
        description: 'I am passionate about sustainable fashion. EcoThreads turns charity shop finds into unique, redesigned clothing. I customise, alter, and embellish second-hand pieces to give them a new life. Funding will help me buy a proper sewing machine, fabric, and set up an online shop.',
        short_description: 'Turning second-hand clothes into one-of-a-kind fashion pieces.',
        category: 'Fashion',
        goal_amount: 750,
        total_raised: 520,
        backer_count: 31,
        status: 'live',
        is_featured: true,
        images: [
          'https://picsum.photos/seed/fashion1/800/600',
          'https://picsum.photos/seed/fashion2/800/600',
        ],
        milestones: [
          { title: 'Sewing machine', description: 'Professional-grade sewing machine for alterations', amount: 350, sort_order: 1 },
          { title: 'Fabrics and materials', description: 'Embellishments, thread, zips, and buttons', amount: 200, sort_order: 2 },
          { title: 'Online shop setup', description: 'Website hosting, photography, and packaging', amount: 200, sort_order: 3 },
        ],
      },
      {
        student_id: studentFinn,
        mentor_id: teacherMrPatel,
        title: 'StudyBuddy — Revision App',
        description: 'I am building a revision app for GCSE students. It uses flashcards, quizzes, and spaced repetition to help you remember what you learn. I have already built a prototype but need funding to pay for hosting, design, and the App Store developer fee.',
        short_description: 'A GCSE revision app with flashcards and spaced repetition.',
        category: 'Technology',
        goal_amount: 1200,
        total_raised: 680,
        backer_count: 42,
        status: 'live',
        is_featured: true,
        images: [
          'https://picsum.photos/seed/studyapp1/800/600',
          'https://picsum.photos/seed/studyapp2/800/600',
          'https://picsum.photos/seed/studyapp3/800/600',
        ],
        milestones: [
          { title: 'App hosting and backend', description: 'Cloud hosting for the first year', amount: 400, sort_order: 1 },
          { title: 'UI/UX design', description: 'Professional app design and icons', amount: 500, sort_order: 2 },
          { title: 'App Store fees', description: 'Apple Developer and Google Play registration', amount: 300, sort_order: 3 },
        ],
      },
      {
        student_id: studentAmara,
        mentor_id: teacherMrPatel,
        title: 'Amara\'s Henna Art',
        description: 'I have been doing henna art since I was 10. I want to turn my passion into a business offering henna for weddings, parties, and events. I need funding for professional henna cones, a portfolio website, and business cards to start taking bookings.',
        short_description: 'Professional henna art for weddings, parties, and events.',
        category: 'Arts & Entertainment',
        goal_amount: 400,
        total_raised: 290,
        backer_count: 18,
        status: 'live',
        is_featured: false,
        images: [
          'https://picsum.photos/seed/henna1/800/600',
          'https://picsum.photos/seed/henna2/800/600',
        ],
        milestones: [
          { title: 'Professional supplies', description: 'Organic henna cones, practice skin, and stencils', amount: 150, sort_order: 1 },
          { title: 'Portfolio website', description: 'Website to showcase work and take bookings', amount: 150, sort_order: 2 },
          { title: 'Marketing materials', description: 'Business cards, flyers, and social media ads', amount: 100, sort_order: 3 },
        ],
      },
      {
        student_id: studentJake,
        mentor_id: teacherMrsJones,
        title: 'Jake\'s Garden Services',
        description: 'I love being outdoors and I am good with plants. I want to start a garden maintenance service for elderly neighbours and busy families. I need funding for a proper lawnmower, garden tools, and flyers to advertise in my local area.',
        short_description: 'Affordable garden maintenance for elderly neighbours and busy families.',
        category: 'Services',
        goal_amount: 600,
        total_raised: 175,
        backer_count: 12,
        status: 'live',
        is_featured: false,
        images: [
          'https://picsum.photos/seed/garden1/800/600',
          'https://picsum.photos/seed/garden2/800/600',
          'https://picsum.photos/seed/garden3/800/600',
        ],
        milestones: [
          { title: 'Lawnmower and tools', description: 'Electric mower, shears, rake, and gloves', amount: 350, sort_order: 1 },
          { title: 'Transport', description: 'Trailer attachment for bike to carry equipment', amount: 150, sort_order: 2 },
          { title: 'Advertising', description: 'Flyers, door hangers, and local Facebook ads', amount: 100, sort_order: 3 },
        ],
      },
      {
        student_id: studentLily,
        mentor_id: teacherMrsJones,
        title: 'PawPrints — Pet Portrait Studio',
        description: 'I love drawing animals. PawPrints is a custom pet portrait business — send me a photo of your pet and I will create a beautiful hand-drawn portrait. I need funding for quality art supplies, frames, and packaging to ship my work safely.',
        short_description: 'Custom hand-drawn pet portraits from your photos.',
        category: 'Crafts & Making',
        goal_amount: 350,
        total_raised: 350,
        backer_count: 27,
        status: 'funded',
        is_featured: false,
        images: [
          'https://picsum.photos/seed/petart1/800/600',
          'https://picsum.photos/seed/petart2/800/600',
        ],
        milestones: [
          { title: 'Art supplies', description: 'Professional pencils, markers, and sketchbooks', amount: 120, sort_order: 1 },
          { title: 'Frames and packaging', description: 'Quality frames and padded mailers', amount: 130, sort_order: 2 },
          { title: 'Website and marketing', description: 'Simple portfolio site and Instagram ads', amount: 100, sort_order: 3 },
        ],
      },
      // ── 3 New Projects (only if additional schools exist) ──
      ...(studentElla && teacherMrWilliams && studentRyan && studentMia && teacherMsDiaz ? [
      {
        student_id: studentElla,
        mentor_id: teacherMrWilliams,
        title: 'CodeClub Kits — Coding for Kids',
        description: 'I run a coding club at my school and lots of younger kids want to learn but do not know where to start. I am creating beginner-friendly coding kits with activity cards, a micro:bit board, and an online guide. Each kit teaches the basics through fun projects like games and animations.',
        short_description: 'Beginner coding kits with micro:bit boards and activity cards for young learners.',
        category: 'Education',
        goal_amount: 800,
        total_raised: 445,
        backer_count: 34,
        status: 'live',
        is_featured: true,
        images: [
          'https://picsum.photos/seed/codekit1/800/600',
          'https://picsum.photos/seed/codekit2/800/600',
          'https://picsum.photos/seed/codekit3/800/600',
        ],
        milestones: [
          { title: 'Micro:bit boards', description: 'Bulk order of 20 micro:bit starter kits', amount: 400, sort_order: 1 },
          { title: 'Activity cards and packaging', description: 'Printed cards, boxes, and instruction booklets', amount: 250, sort_order: 2 },
          { title: 'Online guide hosting', description: 'Website for video tutorials and code downloads', amount: 150, sort_order: 3 },
        ],
      },
      {
        student_id: studentRyan,
        mentor_id: teacherMrWilliams,
        title: 'GreenCycle — School Composting',
        description: 'Our school throws away loads of food waste every day. I want to set up a composting system that turns lunch leftovers into compost for the school garden and local allotments. I need funding for compost bins, collection buckets, and educational posters to get everyone involved.',
        short_description: 'Turning school food waste into compost for the community.',
        category: 'Environment',
        goal_amount: 450,
        total_raised: 210,
        backer_count: 16,
        status: 'live',
        is_featured: false,
        images: [
          'https://picsum.photos/seed/compost1/800/600',
          'https://picsum.photos/seed/compost2/800/600',
        ],
        milestones: [
          { title: 'Compost bins and equipment', description: 'Three large compost tumblers and collection buckets', amount: 250, sort_order: 1 },
          { title: 'Educational materials', description: 'Posters, stickers, and assembly presentation', amount: 100, sort_order: 2 },
          { title: 'Distribution and bags', description: 'Bags and labels for selling finished compost', amount: 100, sort_order: 3 },
        ],
      },
      {
        student_id: studentMia,
        mentor_id: teacherMsDiaz,
        title: 'GoalGetters — Girls Football Academy',
        description: 'There is no girls football team at my school or in my area. I want to start a weekly football academy for girls aged 8 to 16. I need funding for footballs, bibs, cones, first aid kit, and to hire a local pitch. Everyone deserves the chance to play.',
        short_description: 'A weekly football academy giving girls the chance to play and compete.',
        category: 'Sports',
        goal_amount: 550,
        total_raised: 550,
        backer_count: 38,
        status: 'funded',
        is_featured: true,
        images: [
          'https://picsum.photos/seed/football1/800/600',
          'https://picsum.photos/seed/football2/800/600',
          'https://picsum.photos/seed/football3/800/600',
        ],
        milestones: [
          { title: 'Equipment', description: 'Footballs, bibs, cones, goals, and first aid kit', amount: 200, sort_order: 1 },
          { title: 'Pitch hire', description: 'Local astroturf hire for 12 weeks', amount: 250, sort_order: 2 },
          { title: 'Promotion and kit', description: 'Flyers, social media, and team t-shirts', amount: 100, sort_order: 3 },
        ],
      },
      ] : []),
    ];

    const createdProjects: string[] = [];

    for (const proj of projectsData) {
      // Check if project already exists
      const { data: existingProject } = await supabase
        .from('projects')
        .select('id')
        .eq('title', proj.title)
        .maybeSingle();

      if (existingProject) {
        createdProjects.push(existingProject.id);
        // Update images if the project exists but has none
        if (proj.images && proj.images.length > 0) {
          await supabase
            .from('projects')
            .update({ images: proj.images })
            .eq('id', existingProject.id);
        }
        continue;
      }

      const { milestones, ...projectData } = proj;

      const { data: newProject, error: projError } = await supabase
        .from('projects')
        .insert(projectData)
        .select('id')
        .single();

      if (projError) {
        console.error(`Error creating project ${proj.title}:`, projError);
        continue;
      }

      createdProjects.push(newProject.id);

      // Create milestones
      const milestonesWithProjectId = milestones.map((m) => ({
        ...m,
        project_id: newProject.id,
      }));

      const { error: milestoneError } = await supabase
        .from('milestones')
        .insert(milestonesWithProjectId);

      if (milestoneError) {
        console.error(`Error creating milestones for ${proj.title}:`, milestoneError);
      }

      // Create parental consent (approved)
      const parentId = proj.student_id === studentOliver ? parentDavies
        : proj.student_id === studentZara ? parentWilson
        : proj.student_id === studentFinn ? parentBrown
        : proj.student_id === studentAmara ? parentAhmed
        : proj.student_id === studentJake ? parentTaylor
        : proj.student_id === studentElla ? parentMorris
        : proj.student_id === studentRyan ? parentKhan
        : proj.student_id === studentMia ? parentEvans
        : parentGreen;

      await supabase.from('parental_consents').insert({
        student_id: proj.student_id,
        parent_id: parentId,
        project_id: newProject.id,
        status: 'approved',
        consented_at: new Date().toISOString(),
      });
    }

    // ── 7. Create sample backings ──
    // Only create if we have projects and an investor
    const { data: investorProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', 'mark.investor@gmail.com')
      .maybeSingle();

    if (investorProfile && createdProjects.length > 0) {
      const sampleBackings = [
        { project_id: createdProjects[0], backer_id: investorProfile.id, amount: 25, status: 'completed' },
        { project_id: createdProjects[1], backer_id: investorProfile.id, amount: 50, status: 'completed' },
        { project_id: createdProjects[2], backer_id: investorProfile.id, amount: 30, status: 'completed' },
        { project_id: createdProjects[6], backer_id: investorProfile.id, amount: 20, status: 'completed' },
        { project_id: createdProjects[8], backer_id: investorProfile.id, amount: 40, status: 'completed' },
      ];

      for (const backing of sampleBackings) {
        if (!backing.project_id) continue;
        // Check if backing already exists
        const { data: existing } = await supabase
          .from('backings')
          .select('id')
          .eq('project_id', backing.project_id)
          .eq('backer_id', backing.backer_id)
          .maybeSingle();

        if (!existing) {
          await supabase.from('backings').insert({
            ...backing,
            stripe_payment_id: `seed_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${createdProjects.length} projects with users, milestones, consent records, and sample backings.`,
      projectIds: createdProjects,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Seed failed', details: String(error) },
      { status: 500 }
    );
  }
}
