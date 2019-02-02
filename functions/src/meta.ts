import * as moment from "moment";

export class Meta {
  public id: string;
  public epoch: string;
  public text: string;
  public active: boolean;
  public url: string;
  public maxDate: moment.Moment;
}
