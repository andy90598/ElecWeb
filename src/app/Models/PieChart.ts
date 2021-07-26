import { StringOption } from './Options';
export class PieChart{
  public host :any;
  public svg:any;
  public width=0;
  public height=0;
  public radius = 0;
  public htmlElement!: HTMLElement;
  public pieData: StringOption[] = [];
}
