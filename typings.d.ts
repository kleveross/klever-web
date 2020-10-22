declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module 'json2yaml';
declare module 'copy-to-clipboard';
declare module '*.svg' {
  export function ReactComponent(
    props: React.SVGProps<SVGSVGElement>,
  ): React.ReactElement;
  const url: string;
  export default url;
}
