import { mount, unmount } from 'svelte';

function SvelteApplicationMixin(BaseApplication) {
  class SvelteApplication extends BaseApplication {
    #componentInstance;

    constructor(options, ...args) {
      super(options, ...args);
      let initial_props = options?.svelte?.props ?? this.DEFAULT_OPTIONS?.svelte?.props ?? {};
      this.props = $state(initial_props);
    }

    // Provide svelte data via options.svelte
    // Should have .component
    get svelteData() {
      if (!this.options.svelte) throw new Error('No Svelte data found');
      if (!this.options.svelte.component) throw new Error('No Svelte component found');
      return this.options.svelte;
    }

    // Only destroy component on teardown
    async _tearDown(options = {}) {
      // Destroy Component instance
      if (this.#componentInstance) {
        unmount(this.#componentInstance);
        this.#componentInstance = null;
      }

      return super._tearDown(options);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async _renderHTML(context, options) {
      // Update context for props
      this.props.context = context;
      //if(context.source) {
      // this.props.context.source = foundry.utils.duplicate(context.source);
      //}
      return '';
    }

    _replaceHTML(...args) { }

    async _renderFrame(options) {
      const context = await this._prepareContext(options);
      const frame = await super._renderFrame(options);

      const target = this.hasFrame ? frame.querySelector('.window-content') : frame;
      if (!target) return frame;

      const { component } = this.svelteData ?? {};
      if (!component) return frame;

      target.innerContent = '';
      this.props.context = context;
      this.#componentInstance = mount(component, {
        target,
        props: this.props,
      });

      return frame;
    }
  }

  return SvelteApplication;
}

export { SvelteApplicationMixin };