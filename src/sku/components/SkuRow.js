// Utils
import { createNamespace } from '../../utils';
import { BORDER_BOTTOM } from '../../utils/constant';
import { BindEventMixin } from '../../mixins/bind-event';

const [createComponent, bem, t] = createNamespace('sku-row');

export { bem };

export default createComponent({
  mixins: [
    BindEventMixin(function (bind) {
      if (this.scrollable && this.$refs.scroller) {
        bind(this.$refs.scroller, 'scroll', this.onScroll);
      }
    }),
  ],

  props: {
    item: Object,
  },

  data() {
    return {
      progress: 0,
    };
  },

  computed: {
    scrollable() {
      return this.item.largeImageMode && this.item.v.length > 6;
    },
  },

  methods: {
    onScroll() {
      const { scroller, row } = this.$refs;
      const distance = row.offsetWidth - scroller.offsetWidth;
      this.progress = scroller.scrollLeft / distance;
    },

    genTitle() {
      return (
        <div class={bem('title')}>
          {this.item.k}
          {this.item.is_multiple && (
            <span class={bem('title-multiple')}>（{t('multiple')}）</span>
          )}
        </div>
      );
    },

    genIndicator() {
      if (this.scrollable) {
        const style = {
          transform: `translate3d(${this.progress * 20}px, 0, 0)`,
        };

        return (
          <div class={bem('indicator-wrapper')}>
            <div class={bem('indicator')}>
              <div class={bem('indicator-slider')} style={style} />
            </div>
          </div>
        );
      }
    },

    genContent() {
      const nodes = this.slots();

      // 大图模式下，展示顺序特殊，如下
      // 1  2  3  7  8  9
      // 4  5  6  10
      if (this.item.largeImageMode) {
        const firstLineNodes = [];
        const secondLineNodes = [];
        (nodes || []).forEach((node, index) => {
          if (parseInt(index / 3, 10) % 2 === 0) {
            firstLineNodes.push(node);
          } else {
            secondLineNodes.push(node);
          }
        });

        return (
          <div class={bem('scroller')} ref="scroller">
            <div class={bem('row')} ref="row">
              {firstLineNodes}
            </div>
            {secondLineNodes.length > 0 && (
              <div class={bem('row')}>{secondLineNodes}</div>
            )}
          </div>
        );
      }

      return nodes;
    },
  },

  render() {
    return (
      <div class={[bem(), BORDER_BOTTOM]}>
        {this.genTitle()}
        {this.genContent()}
        {this.genIndicator()}
      </div>
    );
  },
});
