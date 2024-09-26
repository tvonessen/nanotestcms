import { IconProps } from "@phosphor-icons/react";
import { Cpu, Gauge, ThermometerSimple } from "@phosphor-icons/react/dist/ssr";

export const productCategories = [
  {
    id: "thermal-characterization",
    title: "Thermal Characterization",
    description:
      "Thermal characterization equipment for TIMs and thermal interface materials.",
    icon: (props: IconProps) => <ThermometerSimple {...props} />,
  },
  {
    id: "mechanical-characterization",
    title: "Mechanical Characterization",
    description: "Mechanical characterization equipment for TIMs.",
    icon: (props: IconProps) => <Gauge {...props} />,
  },
  {
    id: "thermal-test-equipment",
    title: "Thermal Test Equipment",
    description:
      "Thermal test equipment for TIMs and thermal interface material.",
    icon: (props: IconProps) => <Cpu {...props} />,
  },
];
