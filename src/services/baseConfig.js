class BaseConfig {
  constructor() {
    this._defaultEnv = "production";
  }

  getVar(index) {
    return process.env[index] || null;
  }

  getEnv() {
    if (!process.env.NEXT_PUBLIC_ENV) {
      return this._defaultEnv;
    }
    return process.env.NEXT_PUBLIC_ENV;
  }

  isProductionEnv() {
    return this.getEnv() === "production";
  }

  isDevEnv() {
    return this.getEnv() === "development" || this.getEnv() === "dev";
  }

  showPreviewContent() {
    return !this.isProductionEnv();
  }

  getNavbarSlug() {
    return "mainNavbar";
  }

  getFooterSystemId() {
    return "defaultFooter";
  }
}

export default new BaseConfig();
