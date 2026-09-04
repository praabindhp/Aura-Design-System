declare module "*.css";

declare module "*.module.css" {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}

declare module "@praabindh/aura-design-system/styles.css";
