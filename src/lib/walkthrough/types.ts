export interface WalkthroughStep {
  /** The data-walkthrough attribute value to target */
  target: string;
  /** Step title shown in the tooltip */
  title: string;
  /** Step description */
  description: string;
  /** Tooltip position relative to target */
  position: 'top' | 'bottom' | 'left' | 'right';
}
