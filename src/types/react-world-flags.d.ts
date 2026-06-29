declare module "react-world-flags" {
  import { FC } from "react";
  interface FlagProps {
    code: string;
    width?: number | string;
    height?: number | string;
    className?: string;
    style?: React.CSSProperties;
    fallback?: React.ReactNode;
  }
  const Flag: FC<FlagProps>;
  export default Flag;
}
