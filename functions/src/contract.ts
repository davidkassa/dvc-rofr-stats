import * as crypto from "crypto";

export class Contract {
  public availablePoints: string;
  public dateResolved: string;
  public dateSent: string;
  public notes: string;
  public points: number;
  public pricePerPoint: number;
  public resort: string;
  public status: string;
  public totalCost: number;
  public useYear: string;
  public user: string;

  private pchecksum: string;
  public get checksum(): string {
    // exclude dynamic fields: dateResolved, notes, totalCost
    if (!this.pchecksum) {
      const data =
        "" +
        this.availablePoints +
        this.dateSent +
        this.points +
        this.pricePerPoint +
        this.resort +
        this.status +
        this.useYear +
        this.user;

      this.pchecksum = crypto
        .createHash("md5")
        .update(data)
        .digest("hex");
    }

    return this.pchecksum;
  }
}
