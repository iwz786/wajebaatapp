import { UUID } from "crypto";



export interface FormDataInterface {
  receiptDate: string;
  receiptNo: number | UUID | string;
  itsId: number | undefined;
  jamaat: string;
  name: string;
  paidAmount: number | undefined;
  paidCurrency: string;
  paidAmountInWords: string;
  txnId: string;
  txnDate: string;
  chequeNo: string;
  chequeDate: string;
  miscNumber: string;
  takhmeemAmount: number | undefined;
  takhmeemCurrency: string;
  uuid: UUID | string;
  code: string;
}