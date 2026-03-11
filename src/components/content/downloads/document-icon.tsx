import type { IconProps } from '@phosphor-icons/react';
import {
  BlueprintIcon,
  BookOpenTextIcon,
  FileTextIcon,
  PaperPlaneTiltIcon,
  PresentationChartIcon,
  ScrollIcon,
} from '@phosphor-icons/react/dist/ssr';
import type { Document } from '@/payload-types';

interface DocumentIconProps extends IconProps {
  type: Document['type'];
}

export function DocumentIcon({ type, ...props }: DocumentIconProps) {
  switch (type) {
    case 'datasheet':
      return <BlueprintIcon {...props} />;
    case 'flyer':
      return <PaperPlaneTiltIcon {...props} />;
    case 'presentation':
      return <PresentationChartIcon {...props} />;
    case 'whitepaper':
      return <ScrollIcon {...props} />;
    case 'manual':
      return <BookOpenTextIcon {...props} />;
    default:
      return <FileTextIcon {...props} />;
  }
}
