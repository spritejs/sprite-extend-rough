import RoughPlugin from './rough';

const _rect = Symbol('rect');

export default function install({use, utils, registerNodeType}) {
  const {Rough} = use(RoughPlugin);
  const {flow} = utils;

  class RoughRect extends Rough {
    @flow
    get contentSize() {
      const [width, height] = super.contentSize;
      const lineWidth = this.attr('lineWidth');
      return [width + lineWidth, height + lineWidth];
    }

    render(t, context) {
      const {context: roughCanvas, options} = super.render(t, context);

      const lw = this.attr('lineWidth') / 2;
      context.save();
      context.translate(lw, lw);

      const [width, height] = this.attrSize;

      if(!this.generators[_rect]) {
        this.generators[_rect] = roughCanvas.generator.rectangle(0, 0, width, height, options);
      }
      roughCanvas.draw(this.generators[_rect]);

      context.restore();

      return {context: roughCanvas, options};
    }
  }

  registerNodeType('roughRect', RoughRect);

  return {RoughRect};
}
