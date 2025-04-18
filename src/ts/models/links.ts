import { shapes, util } from '@joint/core';

export class CustRect extends shapes.standard.Rectangle {
  override defaults() {
    return {
      ...super.defaults,
      type: 'Rect',
      size: { width: 100, height: 80 },
      attrs: {
        body: {
          width: 'calc(w)',
          height: 'calc(h)',
          fill: 'white',
          strokeWidth: 2,
          stroke: 'black'
        },
        line1: {
          x1: 0, y1: 25, x2: 'calc(w)', y2: 25,
          stroke: 'black', strokeWidth: 1
        },
        line2: {
          x1: 0, y1: 50, x2: 'calc(w)', y2: 50,
          stroke: 'black', strokeWidth: 1
        },
        typeLabel: {
          text: '',
          textVerticalAnchor: 'middle',
          textAnchor: 'middle',
          fontSize: 8,
          fontStyle: 'italic',
          x: 'calc(w/2)',
          y: 4
        },
        label: {
          text: 'Classname',
          textVerticalAnchor: 'middle',
          textAnchor: 'middle',
          fontSize: 12,
          x: 'calc(w/2)',
          y: 17
        },
        secondaryLabel: {
          text: 'Attributes',
          textVerticalAnchor: 'middle',
          textAnchor: 'middle',
          fontSize: 12,
          x: 'calc(w/2)',
          y: 37
        },
        thirdLabel: {
          text: 'Methods',
          textVerticalAnchor: 'middle',
          textAnchor: 'middle',
          fontSize: 12,
          x: 'calc(w/2)',
          y: 65
        }
      }
    };
  }

  override preinitialize() {
    this.markup = util.svg/* xml */ `
      <rect @selector='body' />
      <line @selector='line1' />
      <line @selector='line2' />
      <text @selector='typeLabel' />
      <text @selector='label' />
      <text @selector='secondaryLabel' />
      <text @selector='thirdLabel' />
    `;
  }
}

export class InterfaceRect extends CustRect {
  override defaults() {
    return {
      ...super.defaults(),
      type: 'InterfaceRect',
      attrs: {
        ...super.defaults().attrs,
        body: { ...super.defaults().attrs.body, fill: '#cce5ff' },
        typeLabel: { ...super.defaults().attrs.typeLabel, text: '«interface»', fontSize: 10, y: 5 }
      }
    };
  }
}

export class AbstractRect extends CustRect {
  override defaults() {
    return {
      ...super.defaults(),
      type: 'AbstractRect',
      attrs: {
        ...super.defaults().attrs,
        body: { ...super.defaults().attrs.body, fill: '#ffe6cc' },
        typeLabel: { ...super.defaults().attrs.typeLabel, text: '«abstract»', fontSize: 10, y: 5 }
      }
    };
  }
}

export class EnumRect extends CustRect {
  override defaults() {
    return {
      ...super.defaults(),
      type: 'EnumRect',
      attrs: {
        ...super.defaults().attrs,
        body: { ...super.defaults().attrs.body, fill: '#d3f3d3' },
        typeLabel: { ...super.defaults().attrs.typeLabel, text: '«enum»', fontSize: 10, y: 5 }
      }
    };
  }
}
