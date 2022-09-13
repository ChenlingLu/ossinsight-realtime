import { Plugin } from "vue";

const scopePlugin: Plugin = (app) => {
  app.mixin({
    computed: {
      $scopeId(): string {
        return this.$options.__scopeId;
      },
      $parentScopeId(): string | undefined {
        return this.$parent?.$options.__scopeId;
      },
    },
  });
  app.config.globalProperties
};

declare module 'vue' {
  interface ComponentCustomProperties {
    $scopeId: string
    $parentScopeId: string | undefined
  }
}

export default scopePlugin;
