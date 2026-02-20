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

    // ── 1. Fetch existing schools ──
    const { data: schools } = await supabase.from('schools').select('id, name, email_domain');
    if (!schools || schools.length < 3) {
      return NextResponse.json({ error: 'Need at least 3 schools seeded first' }, { status: 400 });
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
        milestones: [
          { title: 'Art supplies', description: 'Professional pencils, markers, and sketchbooks', amount: 120, sort_order: 1 },
          { title: 'Frames and packaging', description: 'Quality frames and padded mailers', amount: 130, sort_order: 2 },
          { title: 'Website and marketing', description: 'Simple portfolio site and Instagram ads', amount: 100, sort_order: 3 },
        ],
      },
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
        : parentGreen;

      await supabase.from('parental_consents').insert({
        student_id: proj.student_id,
        parent_id: parentId,
        project_id: newProject.id,
        status: 'approved',
        consented_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${createdProjects.length} projects with users, milestones, and consent records.`,
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
