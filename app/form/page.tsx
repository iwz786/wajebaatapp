"use client";

import { FormDataInterface } from "@/app/interfaces/form-data.interface";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import PrintableComponent from "@/app/components/printable/printable";
import { loadTemplate, renderTemplate } from "../utils/loadTemplate";

import { v4 } from "uuid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useSession } from "next-auth/react";


class FormData implements FormDataInterface {
  receiptDate = new Date().toLocaleDateString("en-GB");
  receiptNo = '';
  itsId = undefined;
  jamaat = "";
  name = "";
  paidAmount = undefined;
  paidCurrency = "";
  paidAmountInWords = "";
  txnId = "";
  txnDate = "";
  chequeNo = "";
  chequeDate = "";
  miscNumber = "";
  takhmeemAmount = undefined;
  takhmeemCurrency = "";
  uuid = v4();
  code = ''
  constructor(code: string | undefined) {
    this.code = code;
  }
}

export default function Form() {

  const { data: session } = useSession();
  console.log("form session: ", session)

  const [formData, setFormData] = useState<FormDataInterface>(new FormData(session?.code));

  const [submitActive, setSubmitActive] = useState(true);
  const template = useRef("");
  const [printOut, setPrintOut] = useState("");
  const [code, setCode] = useState('');

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitAndPrint = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    setSubmitActive(false);
    const response = await axios.post("/api/form", formData); //api form
    console.log("response: ", response.data)
    if (response.status === 200) {
      toast.success("Data Submitted Successfully.", {
        position: toast.POSITION.TOP_RIGHT,
      });

      setFormData((prevData) => ({
        ...prevData,
        receiptNo: response.data.receiptId
      }));
      
      await handlePrint(response.data.receiptId, session.code);
    } else {
      toast.error("Data Submission Failed.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    setSubmitActive(true);
  };


  useEffect(() => {
    loadTemplate()
      .then((val) => {
        template.current = val;
      })
      .catch((reason) => {
        console.log("Template loading failed. Will not be able to print");
        toast.error("Failed to load print template. Printing will not work", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  });

  const handlePrint = async (receiptNo: string, code: string) => {
    console.log("receiptNo: ", receiptNo)
    const renderedTemplate = renderTemplate(template.current, {...formData}, receiptNo, code);
    setPrintOut(renderedTemplate);
  };

  useEffect(() => {
    if (printOut != "") {
      window.print()
    }
  }, [printOut])

  function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  

  // useEffect(() => {
  //   const renderedTemplate = renderTemplate(template.current, formData);
  //   setPrintOut(renderedTemplate);
  // }, [formData]);

  const handleClear = (e: any) => {
    setFormData(new FormData(session?.code));
  };

  return (
    <div>
      <div className="container flex flex-col mx-auto p-4 items-center no-print">
        <h1 className="inline-block text-2xl font-bold mb-4">
          Waj Receipt Form {code}
        </h1>
        <form
          // onSubmit={handleSubmitAndPrint}
          className="max-w-full min-w-full mx-auto"
        >
          <div className="grid lg:grid-cols-5 gap-3">
            <label className="form-field col-span-1">
              Receipt Date (DD/MM/YYYY)
            </label>
            <input
              type="text"
              name="receiptDate"
              value={formData.receiptDate}
              onChange={handleChange}
              className="col-span-2 p-2 border rounded"
              pattern="(0?[1-9]|[12][0-9]|3[01])/(0?[1-9]|[1][0-2])/[0-9]{4}$"
              required
            />

            <label className="form-field col-span-1 ">Receipt No.</label>
            <input
              type="text"
              name="receiptNo"
              value={formData.receiptNo || ""}
              onChange={handleChange}
              className="col-span-1 p-2 border rounded"
              disabled={true}
              required
            />

            <label className="form-field col-span-1 ">ITS ID</label>
            <input
              type="text"
              name="itsId"
              value={formData.itsId || ""}
              onChange={handleChange}
              className="col-span-2 p-2 border rounded"
              pattern="[0-9]{8}$"
              required
            />

            <label className="form-field col-span-1 ">Jamaat</label>
            <input
              type="text"
              name="jamaat"
              value={formData.jamaat}
              onChange={handleChange}
              className="col-span-1 p-2 border rounded"
              required
            />

            <label className="form-field col-span-1 ">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="col-span-4 p-2 border rounded"
              required
            />

            <label className="form-field col-span-1 ">Paid Amount</label>
            <input
              type="text"
              name="paidAmount"
              value={formData.paidAmount || ""}
              onChange={handleChange}
              className="col-span-2 p-2 border rounded"
              pattern="[0-9]+"
              required
            />

            <label className="form-field col-span-1 ">Paid Currency</label>
            <input
              type="text"
              name="paidCurrency"
              value={formData.paidCurrency}
              onChange={handleChange}
              className="col-span-1 p-2 border rounded"
              pattern="[A-Za-z]+"
              required
            />

            <label className="form-field col-span-1 ">
              Paid Amount in words
            </label>
            <input
              type="text"
              name="paidAmountInWords"
              value={formData.paidAmountInWords}
              onChange={handleChange}
              className="col-span-4 p-2 border rounded"
              pattern="^[a-zA-Z ]*$"
              required
            />

            {/* <div className='col-span-5 font-bold'>
              (Select as applicable)
            </div> */}

            <label className="form-field col-span-1 ">TXN ID</label>
            <input
              type="text"
              name="txnId"
              value={formData.txnId}
              onChange={handleChange}
              className="col-span-1 p-2 border rounded"
            />

            <label className="form-field col-span-1 ">TXN Date (DD/MM/YYYY)</label>
            <input
              type="text"
              name="txnDate"
              value={formData.txnDate}
              onChange={handleChange}
              pattern="(0?[1-9]|[12][0-9]|3[01])/(0?[1-9]|[1][0-2])/[0-9]{4}$"
              className="col-span-2 p-2 border rounded"
            />

            <label className="form-field col-span-1 ">Cheque No.</label>
            <input
              type="text"
              name="chequeNo"
              value={formData.chequeNo}
              onChange={handleChange}
              className="col-span-1 p-2 border rounded"
            />

            <label className="form-field col-span-1 ">Cheque Date (DD/MM/YYYY)</label>
            <input
              type="text"
              name="chequeDate"
              value={formData.chequeDate}
              onChange={handleChange}
              pattern="(0?[1-9]|[12][0-9]|3[01])/(0?[1-9]|[1][0-2])/[0-9]{4}$"
              className="col-span-2 p-2 border rounded"
            />

            <div className="font-bold col-span-5">Additional Information</div>

            <label className="form-field col-span-1 ">
              Takhmeem Amount (as per Faram)
            </label>
            <input
              type="text"
              name="takhmeemAmount"
              value={formData.takhmeemAmount || ""}
              onChange={handleChange}
              pattern="[0-9]+"
              className="col-span-2 p-2 border rounded"
            />
            <label className="form-field col-span-1 ">
              Takhmeem Currency (as per Faram)
            </label>
            <input
              type="text"
              name="takhmeemCurrency"
              value={formData.takhmeemCurrency}
              onChange={handleChange}
              pattern="[A-Za-z]+"
              className="col-span-1 p-2 border rounded"
            />
          </div>
          <div className="flex flex-row justify-center mt-5">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded m-5 w-28 disabled:opacity-75"
              disabled={!submitActive}
              onClick={handleSubmitAndPrint}
            >
              Submit and Print
            </button>

            <button
              type="button"
              className="bg-blue-500 text-white p-2 rounded m-5 w-28"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
      <div className="print hidden">
        <PrintableComponent template={printOut}></PrintableComponent>
      </div>
    </div>
  );
}
