import ejs from 'ejs'
import { FormDataInterface } from '../interfaces/form-data.interface';


export async function loadTemplate () {
    const response = await fetch('template.html');
    return await response.text();
}

export function renderTemplate(template: string, formData: any, receiptNo?: string, code?: string) {
  formData.receiptNo = receiptNo
  formData.code = code
  console.log("formdata render: ", formData)
  return ejs.render(template, {formData});
}
  