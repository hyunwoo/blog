import _ from 'lodash';
export interface UiCategory {
  name: string;
  value: string;
}
export interface UiBoardIcon {
  icon: string;
  value: number;
  color: string;
}

export class UiConfiguration {
  public static readonly uiCategories: UiCategory[] = [
    { name: 'Notice', value: 'notice' },
    { name: 'Board', value: 'board' }
  ];

  public static readonly uiBoardIcons: UiBoardIcon[] = [
    { icon: 'favorite', value: 0, color: 'red' },
    { icon: 'star', value: 1, color: 'blue' },
    { icon: 'thumb_up', value: 2, color: 'teal' },
    { icon: 'thumb_down', value: 3, color: 'indigo' },
    { icon: 'help', value: 4, color: 'brown' },
    { icon: 'pets', value: 5, color: 'pink' }
  ];

  public static get uiCategoryValues(): string[] {
    return _.map(UiConfiguration.uiCategories, (cat) => cat.value);
  }
  public static get uiCategoryNames(): string[] {
    return _.map(UiConfiguration.uiCategories, (cat) => cat.name);
  }
  public static getUiCategoryValueFromName(name: string): string {
    const o = _.find(UiConfiguration.uiCategories, (cat) => cat.name === name);
    return o === undefined ? UiConfiguration.uiCategories[0].value : o.value;
  }
  public static getUICategoryNameFromValue(value: string): string {
    const o = _.find(
      UiConfiguration.uiCategories,
      (cat) => cat.value === value
    );
    return o === undefined ? UiConfiguration.uiCategories[0].name : o.name;
  }
  public static getUIIconFromValue(value: number): UiBoardIcon {
    const o = _.find(
      UiConfiguration.uiBoardIcons,
      (cat) => cat.value === value
    );
    return o === undefined ? UiConfiguration.uiBoardIcons[0] : o;
  }
}
