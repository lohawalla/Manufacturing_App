import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native'; // Assuming you're using React for the web or a similar environment
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { useRoute } from '@react-navigation/native';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import Spinner from 'react-native-loading-spinner-overlay';
import { usePostMultipleSlipsMutation } from '../../redux/features/apis2/Manufacturing';
import { formatDecimal } from '../formateDecimal/formatDecimal';

function GenerateSlip({ navigation }) {
  const route = useRoute()
  const { arr, val } = route.params
  const [isLoading, setIsLoading] = useState(false);
  const [receivedData, setReceivedData] = useState();
  const [count, setCount] = useState(1);
  const [margin, setMargin] = useState([]);
  const [addNewPost, { data: allWorkOrder, isError: allWorkOrderError, isLoading: allWorkOrderLoading }] = usePostMultipleSlipsMutation();
  useEffect(() => {
    (async () => {
      try {
        const { result } = await addNewPost(arr).unwrap();
        if (result.length === 0) {
          return;
        }
        setReceivedData(result);
      } catch (error) {
        console.error('Error fetching or processing data:', error);
      }
    })();
  }, []);

  const formatDate = (str) => {
    const date = new Date(str);
    date.setHours(date.getHours() - 5);
    date.setMinutes(date.getMinutes() - 30);
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    let hours = date.getHours() === 0 ? 12 : date.getHours() >= 13 ? date.getHours() - 12 : date.getHours();
    const minutes = date.getMinutes();
    let amPm = date.getHours() >= 12 ? "pm" : "am"
    const year = date.getFullYear();
    return `${hours}:${minutes} ${amPm}, ${day}/${month}/${year}`;
  }
  const formatDateUTC = (str) => {
    const date = new Date(str);
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    let hours = date.getHours() === 0 ? 12 : date.getHours() >= 13 ? date.getHours() - 12 : date.getHours();
    const minutes = date.getMinutes();
    let amPm = date.getHours() >= 12 ? "pm" : "am"
    const year = date.getFullYear();
    return `${hours}:${minutes} ${amPm}, ${day}/${month}/${year}`;
  }
  console.log(arr, margin, receivedData, val);
  const generatePDF = async (val) => {
    console.log(val)
    setIsLoading(true);
    if (val === 'Completed') {
      console.log("Hii")
      try {
        const timestamp = Date.now();
        const fileName = `my_document_${timestamp}.pdf`;
        const html = `
          ${receivedData.map((element, index) => `
          <style>
            .your-content-class {
              page-break-before: auto;
              page-break-after: auto;
              page-break-inside: auto;
              overflow: hidden;
            }
          </style>
      <div style="height:250px" class="your-content-class">
        <div class="px-2 py-2 w-[700px]" style="padding: 16px; width: 800px;">
          <div class="flex flex-row justify-between" style="display: flex; flex-direction: row; justify-content: space-between;">
            <div class="left-column" style="display: flex; flex-direction: column;">
              <div style="display: flex; flex-direction: row; justify-content: stretch;">
                <div class="header" style="display: flex; gap: 2px;">
                  <h1 class="text-base leading-5 font-bold tracking-[0.06px] text-[#2E2E2E]" style="font-size: 16px; font-weight: bold; color: #2E2E2E;margin-right:10px">#${element.productionSlipNumber}</h1>
                  <div class="border" style="width: 1px; height: 30px; background-color: #0d0d0d; border: 1px solid #0d0d0d;margin-right:10px"></div>
                  <h1 class="text-base leading-5 font-bold tracking-[0.06px] text-[#2E2E2E]" style="font-size: 16px; font-weight: bold; color: #2E2E2E;margin-right:10px">${element.processName}</h1>
                  <div class="border" style="width: 1px; height: 30px; background-color: #0d0d0d; border: 1px solid #0d0d0d;margin-right:10px"></div>
                  <h1 class="text-base leading-5 font-bold tracking-[0.06px] text-[#2E2E2E]" style="font-size: 16px; font-weight: bold; color: #2E2E2E;">${val}</h1>
                  </div>
                <div style="margin-left: 130px;align-self: center;">
                  <img src="${element.QRCode}" alt="" class="w-[60px] h-[60px]" style="width: 70px; height: 70px;" />
                </div>
              </div>
              <div class="details" style="display: flex; flex-direction: column; margin-top: -40px;">
                <p class="text-[9px] leading-3 font-medium tracking-[0.06px] text-[#666666]" style="font-size: 9px; margin-top: 0; margin-bottom: 0; line-height: 1; font-medium; color: #666666;">Ordered at ${element.orderAt ? formatDate(element.orderAt) : "DATE..."}</p>
                <p class="text-[9px] leading-3 font-medium tracking-[0.06px] text-[#666666]" style="font-size: 9px; margin-top: 0; margin-bottom: 0; line-height: 1; font-medium; color: #666666;">MCode - ${element.MCode}</p>
                <p class="text-[9px] leading-3 font-medium tracking-[0.06px] text-[#666666]" style="font-size: 9px; margin-top: 0; margin-bottom: 0; line-height: 1; font-medium; color: #666666;">Part Code - ${element.partCode}</p>
                <p class="text-[9px] leading-3 font-medium tracking-[0.06px] text-[#666666]" style="font-size: 9px; margin-top: 0; margin-bottom: 0; line-height: 1; font-medium; color: #666666;">Work Order No. - #${element.workOrderNumber}</p>
              </div>
            </div>
          </div>
          <div style="margin-top: 0px; margin-bottom: -8px;">
            <table class="w-full table" style="border: 1px solid black;">
              <tbody>
                <tr style="border: 1px solid black;">
                  <td class="bg-[#080808] pb-2 px-[18.71px] border border-solid border[#DEDEDE]" style="padding: 8px 20px; font-size: 14px; font-weight: bold; border: 1px solid black; color: #080808; white-space: nowrap;">Finish Item</td>
                  <td class="bg-[#FAFAFA] pb-2 px-[18.71px] border border-solid border[#DEDEDE]" style="padding: 8px 20px; font-size: 14px; font-weight: bold; border: 1px solid black; color: #080808; white-space: nowrap;">Production Item</td>
                  <td class="bg-[#FAFAFA] pb-2 px-[18.71px] border border-solid border[#DEDEDE]" style="padding: 8px 20px; font-size: 14px; font-weight: bold; border: 1px solid black; color: #080808; white-space: nowrap;">Consumption Items</td>
                </tr>
                <tr style="border: 1px solid black;">
                  <td class="pb-2 px-[18.71px] text-[10.92px] font-normal border border-solid border[#DEDEDE]" style="padding: 8px 20px; border: 1px solid black; font-size: 14px; font-weight: bold; color: #080808; white-space: nowrap;">${element.finishItemName.length > 30 ? element.finishItemName.substring(0, 30) + ' ...' : element.finishItemName}</td>
                  <td class="px-[18.71px] border border-solid border[#DEDEDE] py-2" style="padding: 8px 20px; font-size: 14px; border: 1px solid black; font-weight: bold; color: #080808; white-space: nowrap;">
                    <div class="flex justify-between items-center production-item" style="display: flex; justify-content: space-between; align-items: center;">
                      <p class="text-[10.92px] font-normal" style="font-size: 10.92px; font-normal;">${element.productionItem.length > 30 ? element.productionItem.substring(0, 30) + "..." : element.productionItem}</p>
                      <div class="flex flex-col justify-center items-center" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                      <input class="w-[53px] h-[22px] border border-solid border-[#DEDEDE] rounded-[3.72px] focus:outline-none" style="height: 22px; width: 53px; border: 1px solid #DEDEDE; border-radius: 3.72px; outline: none; text-align: center;" type="text" value="${element.itemProduced}" />
                      </div>
                    </div>
                  </td>
                  <td class="px-[18.71px] border border-solid border[#DEDEDE] pb-2" style="padding: 8px 20px; border: 1px solid black; font-size: 14px; font-weight: bold; color: #080808; white-space: nowrap;">
                    <div class="flex justify-between items-center consumption-item" key=${index} style="display: flex; justify-content: space-between; align-items: center;">
                      <p class="text-[10.92px] font-normal" style="font-size: 10.92px; font-normal;">${element.consumptionItem.length}</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="flex justify-between items-center footer margin-bottom: -6px; margin-top: -6px;" style="display: flex; justify-content: space-around;">
              <p class="text-[9.3px] leading-3 tracking-[0.06px] text-[#949494]" style="font-size: 9.3px; line-height: 3; tracking: 0.06px; color: #949494;">#${element.productionSlipNumber}</p>
              <p class="text-[9.3px] leading-3 tracking-[0.06px] text-[#949494]" style="font-size: 9.3px; line-height: 3; tracking: 0.06px; color: #949494;">Generated at ${formatDateUTC(element.createdAt)}.</p>
            </div>
            <p class="text-[9.3px] leading-3 tracking-[0.06px] text-[#666666]" style="font-size: 9.3px; margin-bottom: 0; tracking: 0.06px; color: #666666; margin-top: -13px;">Production slip under ${element.shopName} of Chawla Components Pvt. Ltd.</p>
            <div class="" style="border: 1px solid #0d0d0d;margin-top: -3px;"></div>
          </div>
        </div>
      </div>
    `).join('')}`

        // Create a PDF file using react-native-html-to-pdf
        const pdfOptions = {
          html,
          fileName,
          directory: 'Documents',
          height: 1049,
        };
        const pdfFile = await RNHTMLtoPDF.convert(pdfOptions);
        const sourcePath = pdfFile.filePath;
        const destinationPath = `${RNFS.ExternalStorageDirectoryPath}/Download/${fileName}`;
        await RNFS.moveFile(sourcePath, destinationPath);
        alert(`PDF saved to ${destinationPath}`)
        console.log(`PDF saved to ${destinationPath}`);
        navigation.navigate('dashboard')
      } catch (error) {
        console.error('Error generating PDF:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const timestamp = Date.now();
        const fileName = `my_document_${timestamp}.pdf`;
        const html = `
          ${receivedData.map((element, index) => `
          <style>
            .your-content-class {
              page-break-before: auto;
              page-break-after: auto;
              page-break-inside: auto;
              overflow: hidden;
            }
          </style>
      <div style="height:250px" class="your-content-class">
        <div class="px-2 py-2 w-[700px]" style="padding: 16px; width: 800px;">
          <div class="flex flex-row justify-between" style="display: flex; flex-direction: row; justify-content: space-between;">
            <div class="left-column" style="display: flex; flex-direction: column;">
              <div style="display: flex; flex-direction: row; justify-content: stretch;">
                <div class="header" style="display: flex; gap: 2px;">
                  <h1 class="text-base leading-5 font-bold tracking-[0.06px] text-[#2E2E2E]" style="font-size: 16px; font-weight: bold; color: #2E2E2E;margin-right:10px">#${element.productionSlipNumber}</h1>
                  <div class="border" style="width: 1px; height: 30px; background-color: #0d0d0d; border: 1px solid #0d0d0d;margin-right:10px"></div>
                  <h1 class="text-base leading-5 font-bold tracking-[0.06px] text-[#2E2E2E]" style="font-size: 16px; font-weight: bold; color: #2E2E2E;margin-right:10px">${element.processName}</h1>
                  <div class="border" style="width: 1px; height: 30px; background-color: #0d0d0d; border: 1px solid #0d0d0d;margin-right:10px"></div>
                  <h1 class="text-base leading-5 font-bold tracking-[0.06px] text-[#2E2E2E]" style="font-size: 16px; font-weight: bold; color: #2E2E2E;">${val}</h1>
                  </div>
                <div style="margin-left: 130px;align-self: center;">
                  <img src="${element.QRCode}" alt="" class="w-[60px] h-[60px]" style="width: 70px; height: 70px;" />
                </div>
              </div>
              <div class="details" style="display: flex; flex-direction: column; margin-top: -40px;">
                <p class="text-[9px] leading-3 font-medium tracking-[0.06px] text-[#666666]" style="font-size: 9px; margin-top: 0; margin-bottom: 0; line-height: 1; font-medium; color: #666666;">Ordered at ${element.orderAt ? formatDate(element.orderAt) : "DATE..."}</p>
                <p class="text-[9px] leading-3 font-medium tracking-[0.06px] text-[#666666]" style="font-size: 9px; margin-top: 0; margin-bottom: 0; line-height: 1; font-medium; color: #666666;">MCode - ${element.MCode}</p>
                <p class="text-[9px] leading-3 font-medium tracking-[0.06px] text-[#666666]" style="font-size: 9px; margin-top: 0; margin-bottom: 0; line-height: 1; font-medium; color: #666666;">Part Code - ${element.partCode}</p>
                <p class="text-[9px] leading-3 font-medium tracking-[0.06px] text-[#666666]" style="font-size: 9px; margin-top: 0; margin-bottom: 0; line-height: 1; font-medium; color: #666666;">Produced Item - ${element.itemProduced}</p>
                <p class="text-[9px] leading-3 font-medium tracking-[0.06px] text-[#666666]" style="font-size: 9px; margin-top: 0; margin-bottom: 0; line-height: 1; font-medium; color: #666666;">Work Order No. - #${element.workOrderNumber}</p>
              </div>
            </div>
          </div>
          <div style="margin-top: 0px; margin-bottom: -8px;">
            <table class="w-full table" style="border: 1px solid black;">
              <tbody>
                <tr style="border: 1px solid black;">
                  <td class="bg-[#080808] pb-2 px-[18.71px] border border-solid border[#DEDEDE]" style="padding: 8px 20px; font-size: 14px; font-weight: bold; border: 1px solid black; color: #080808; white-space: nowrap;">Finish Item</td>
                  <td class="bg-[#FAFAFA] pb-2 px-[18.71px] border border-solid border[#DEDEDE]" style="padding: 8px 20px; font-size: 14px; font-weight: bold; border: 1px solid black; color: #080808; white-space: nowrap;">Production Item</td>
                  <td class="bg-[#FAFAFA] pb-2 px-[18.71px] border border-solid border[#DEDEDE]" style="padding: 8px 20px; font-size: 14px; font-weight: bold; border: 1px solid black; color: #080808; white-space: nowrap;">Consumption Items</td>
                </tr>
                <tr style="border: 1px solid black;">
                  <td class="pb-2 px-[18.71px] text-[10.92px] font-normal border border-solid border[#DEDEDE]" style="padding: 8px 20px; border: 1px solid black; font-size: 14px; font-weight: bold; color: #080808; white-space: nowrap;">${element.finishItemName.length > 30 ? element.finishItemName.substring(0, 30) + ' ...' : element.finishItemName}</td>
                  <td class="px-[18.71px] border border-solid border[#DEDEDE] py-2" style="padding: 8px 20px; font-size: 14px; border: 1px solid black; font-weight: bold; color: #080808; white-space: nowrap;">
                    <div class="flex justify-between items-center production-item" style="display: flex; justify-content: space-between; align-items: center;">
                      <p class="text-[10.92px] font-normal" style="font-size: 10.92px; font-normal;">${element.productionItem.length > 30 ? element.productionItem.substring(0, 30) + "..." : element.productionItem}</p>
                      <div class="flex flex-col justify-center items-center" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                        <input class="w-[53px] h-[22px] border border-solid border-[#DEDEDE] rounded-[3.72px] focus:outline-none" style="height: 22px; width: 53px; border: 1px solid #DEDEDE; border-radius: 3.72px; outline: none;" type="text" />
                        <p class="text-xs font-bold" style="font-size: 11px;">${element.pendingRequirement} NOS</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-[18.71px] border border-solid border[#DEDEDE] pb-2" style="padding: 8px 20px; border: 1px solid black; font-size: 14px; font-weight: bold; color: #080808; white-space: nowrap;">
                    <div class="flex justify-between items-center consumption-item" key=${index} style="display: flex; justify-content: space-between; align-items: center;">
                      <p class="text-[10.92px] font-normal" style="font-size: 10.92px; font-normal;">${element.consumptionItem.length}</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="flex justify-between items-center footer margin-bottom: -6px; margin-top: -6px;" style="display: flex; justify-content: space-around;">
              <p class="text-[9.3px] leading-3 tracking-[0.06px] text-[#949494]" style="font-size: 9.3px; line-height: 3; tracking: 0.06px; color: #949494;">#${element.productionSlipNumber}</p>
              <p class="text-[9.3px] leading-3 tracking-[0.06px] text-[#949494]" style="font-size: 9.3px; line-height: 3; tracking: 0.06px; color: #949494;">Generated at ${formatDateUTC(element.createdAt)}.</p>
            </div>
            <p class="text-[9.3px] leading-3 tracking-[0.06px] text-[#666666]" style="font-size: 9.3px; margin-bottom: 0; tracking: 0.06px; color: #666666; margin-top: -13px;">Production slip under ${element.shopName} of Chawla Components Pvt. Ltd.</p>
            <div class="" style="border: 1px solid #0d0d0d;margin-top: -3px;"></div>
          </div>
        </div>
      </div>
    `).join('')}`
        // Create a PDF file using react-native-html-to-pdf
        const pdfOptions = {
          html,
          fileName,
          directory: 'Documents',
          height: 1049,
        };
        const pdfFile = await RNHTMLtoPDF.convert(pdfOptions);
        const sourcePath = pdfFile.filePath;
        const destinationPath = `${RNFS.ExternalStorageDirectoryPath}/Download/${fileName}`;
        await RNFS.moveFile(sourcePath, destinationPath);
        alert(`PDF saved to ${destinationPath}`)
        console.log(`PDF saved to ${destinationPath}`);
        navigation.navigate('dashboard')
      } catch (error) {
        console.error('Error generating PDF:', error);
      } finally {
        setIsLoading(false);
      }
    }
    navigation.navigate("dashboard")
  };
  const sharePDF = async (val) => {
    console.log(val)
    setIsLoading(true);
    if (val === 'Completed') {
      console.log("Hi", val)
      const timestamp = Date.now();
      const fileName = `my_document_${timestamp}.pdf`;
      const html = `
        ${receivedData.map((element, index) => `
        <style>
            .your-content-class {
              page-break-before: auto;
              page-break-after: auto;
              page-break-inside: auto;
              overflow: hidden;
            }
          </style>
      <div style="height:250px" class="your-content-class">
        <div class="px-2 py-2 w-[700px]" style="padding: 16px; width: 800px;">
          <div class="flex flex-row justify-between" style="display: flex; flex-direction: row; justify-content: space-between;">
            <div class="left-column" style="display: flex; flex-direction: column;">
              <div style="display: flex; flex-direction: row; justify-content: stretch;">
                <div class="header" style="display: flex; gap: 2px;">
                  <h1 class="text-base leading-5 font-bold tracking-[0.06px] text-[#2E2E2E]" style="font-size: 16px; font-weight: bold; color: #2E2E2E;margin-right:10px">#${element.productionSlipNumber}</h1>
                  <div class="border" style="width: 1px; height: 30px; background-color: #0d0d0d; border: 1px solid #0d0d0d;margin-right:10px"></div>
                  <h1 class="text-base leading-5 font-bold tracking-[0.06px] text-[#2E2E2E]" style="font-size: 16px; font-weight: bold; color: #2E2E2E;margin-right:10px">${element.processName}</h1>
                  <div class="border" style="width: 1px; height: 30px; background-color: #0d0d0d; border: 1px solid #0d0d0d;margin-right:10px"></div>
                  <h1 class="text-base leading-5 font-bold tracking-[0.06px] text-[#2E2E2E]" style="font-size: 16px; font-weight: bold; color: #2E2E2E;">${val}</h1>
                  </div>
                <div style="margin-left: 130px;align-self: center;">
                  <img src="${element.QRCode}" alt="" class="w-[60px] h-[60px]" style="width: 70px; height: 70px;" />
                </div>
              </div>
              <div class="details" style="display: flex; flex-direction: column; margin-top: -40px;">
                <p class="text-[9px] leading-3 font-medium tracking-[0.06px] text-[#666666]" style="font-size: 9px; margin-top: 0; margin-bottom: 0; line-height: 1; font-medium; color: #666666;">Ordered at ${element.orderAt ? formatDate(element.orderAt) : "DATE..."}</p>
                <p class="text-[9px] leading-3 font-medium tracking-[0.06px] text-[#666666]" style="font-size: 9px; margin-top: 0; margin-bottom: 0; line-height: 1; font-medium; color: #666666;">MCode - ${element.MCode}</p>
                <p class="text-[9px] leading-3 font-medium tracking-[0.06px] text-[#666666]" style="font-size: 9px; margin-top: 0; margin-bottom: 0; line-height: 1; font-medium; color: #666666;">Part Code - ${element.partCode}</p>
                <p class="text-[9px] leading-3 font-medium tracking-[0.06px] text-[#666666]" style="font-size: 9px; margin-top: 0; margin-bottom: 0; line-height: 1; font-medium; color: #666666;">Work Order No. - #${element.workOrderNumber}</p>
              </div>
            </div>
          </div>
          <div style="margin-top: 0px; margin-bottom: -8px;">
            <table class="w-full table" style="border: 1px solid black;">
              <tbody>
                <tr style="border: 1px solid black;">
                  <td class="bg-[#080808] pb-2 px-[18.71px] border border-solid border[#DEDEDE]" style="padding: 8px 20px; font-size: 14px; font-weight: bold; border: 1px solid black; color: #080808; white-space: nowrap;">Finish Item</td>
                  <td class="bg-[#FAFAFA] pb-2 px-[18.71px] border border-solid border[#DEDEDE]" style="padding: 8px 20px; font-size: 14px; font-weight: bold; border: 1px solid black; color: #080808; white-space: nowrap;">Production Item</td>
                  <td class="bg-[#FAFAFA] pb-2 px-[18.71px] border border-solid border[#DEDEDE]" style="padding: 8px 20px; font-size: 14px; font-weight: bold; border: 1px solid black; color: #080808; white-space: nowrap;">Consumption Items</td>
                </tr>
                <tr style="border: 1px solid black;">
                  <td class="pb-2 px-[18.71px] text-[10.92px] font-normal border border-solid border[#DEDEDE]" style="padding: 8px 20px; border: 1px solid black; font-size: 14px; font-weight: bold; color: #080808; white-space: nowrap;">${element.finishItemName.length > 30 ? element.finishItemName.substring(0, 30) + ' ...' : element.finishItemName}</td>
                  <td class="px-[18.71px] border border-solid border[#DEDEDE] py-2" style="padding: 8px 20px; font-size: 14px; border: 1px solid black; font-weight: bold; color: #080808; white-space: nowrap;">
                    <div class="flex justify-between items-center production-item" style="display: flex; justify-content: space-between; align-items: center;">
                      <p class="text-[10.92px] font-normal" style="font-size: 10.92px; font-normal;">${element.productionItem.length > 30 ? element.productionItem.substring(0, 30) + "..." : element.productionItem}</p>
                      <div class="flex flex-col justify-center items-center" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                      <input class="w-[53px] h-[22px] border border-solid border-[#DEDEDE] rounded-[3.72px] focus:outline-none" style="height: 22px; width: 53px; border: 1px solid #DEDEDE; border-radius: 3.72px; outline: none; text-align: center;" type="text" value="${element.itemProduced}" />
                      </div>
                    </div>
                  </td>
                  <td class="px-[18.71px] border border-solid border[#DEDEDE] pb-2" style="padding: 8px 20px; border: 1px solid black; font-size: 14px; font-weight: bold; color: #080808; white-space: nowrap;">
                    <div class="flex justify-between items-center consumption-item" key=${index} style="display: flex; justify-content: space-between; align-items: center;">
                      <p class="text-[10.92px] font-normal" style="font-size: 10.92px; font-normal;">${element.consumptionItem.length}</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="flex justify-between items-center footer margin-bottom: -6px; margin-top: -6px;" style="display: flex; justify-content: space-around;">
              <p class="text-[9.3px] leading-3 tracking-[0.06px] text-[#949494]" style="font-size: 9.3px; line-height: 3; tracking: 0.06px; color: #949494;">#${element.productionSlipNumber}</p>
              <p class="text-[9.3px] leading-3 tracking-[0.06px] text-[#949494]" style="font-size: 9.3px; line-height: 3; tracking: 0.06px; color: #949494;">Generated at ${formatDateUTC(element.createdAt)}.</p>
            </div>
            <p class="text-[9.3px] leading-3 tracking-[0.06px] text-[#666666]" style="font-size: 9.3px; margin-bottom: 0; tracking: 0.06px; color: #666666; margin-top: -13px;">Production slip under ${element.shopName} of Chawla Components Pvt. Ltd.</p>
            <div class="" style="border: 1px solid #0d0d0d;margin-top: -3px;"></div>
          </div>
        </div>
      </div>
    `).join('')}`
      const pdfOptions = {
        html,
        fileName,
        directory: 'Documents',
        height: 1048,
      };
      const pdfFile = await RNHTMLtoPDF.convert(pdfOptions);
      const destinationPath = `${RNFS.ExternalStorageDirectoryPath}/Download/${fileName}`;
      const fileExists = await RNFS.exists(destinationPath);
      if (!fileExists) {
        const sourcePath = pdfFile.filePath;
        await RNFS.moveFile(sourcePath, destinationPath);
      }
      const type = 'application/pdf';
      if (Platform.OS === 'android') {
        const base64Data = await RNFS.readFile(destinationPath, 'base64');
        const base64DataWithHeader = `data:application/pdf;base64,${base64Data}`;
        try {
          await Share.open({ title: 'Share PDF', url: base64DataWithHeader, type });
        } catch (error) {
          console.error('Error sharing PDF:', error);
        }
      } else {
        const options = {
          title: 'Share PDF',
          url: destinationPath,
          type: 'application/pdf',
        };
        try {
          const result = await Share.open(options);
          if (result.app) {
            console.log(`Shared via ${result.app}`);
          } else {
            console.log('Shared');
          }
        } catch (error) {
          console.error('Error sharing PDF:', error);
        }
      }
    } else {
      const timestamp = Date.now();
      const fileName = `my_document_${timestamp}.pdf`;
      const html = `
        ${receivedData.map((element, index) => `
        <style>
          .your-content-class {
            page-break-before: auto;
            page-break-after: auto;
            page-break-inside: auto;
            overflow: hidden;
          }
        </style>
    <div style="height:250px" class="your-content-class">
      <div class="px-2 py-2 w-[700px]" style="padding: 16px; width: 800px;">
        <div class="flex flex-row justify-between" style="display: flex; flex-direction: row; justify-content: space-between;">
          <div class="left-column" style="display: flex; flex-direction: column;">
            <div style="display: flex; flex-direction: row; justify-content: stretch;">
              <div class="header" style="display: flex; gap: 2px;">
                <h1 class="text-base leading-5 font-bold tracking-[0.06px] text-[#2E2E2E]" style="font-size: 16px; font-weight: bold; color: #2E2E2E;margin-right:10px">#${element.productionSlipNumber}</h1>
                <div class="border" style="width: 1px; height: 30px; background-color: #0d0d0d; border: 1px solid #0d0d0d;margin-right:10px"></div>
                <h1 class="text-base leading-5 font-bold tracking-[0.06px] text-[#2E2E2E]" style="font-size: 16px; font-weight: bold; color: #2E2E2E;">${element.processName}</h1>
                <div class="border" style="width: 1px; height: 30px; background-color: #0d0d0d; border: 1px solid #0d0d0d;margin-right:10px"></div>
                <h1 class="text-base leading-5 font-bold tracking-[0.06px] text-[#2E2E2E]" style="font-size: 16px; font-weight: bold; color: #2E2E2E;">${val}</h1>
              </div>
              <div style="margin-left: 130px;align-self: center;">
              <img src="${element.QRCode}" alt="" class="w-[60px] h-[60px]" style="width: 70px; height: 70px;" />
              </div>
            </div>
            <div class="details" style="display: flex; flex-direction: column; margin-top: -40px;">
              <p class="text-[9px] leading-3 font-medium tracking-[0.06px] text-[#666666]" style="font-size: 9px; margin-top: 0; margin-bottom: 0; line-height: 1; font-medium; color: #666666;">Ordered at ${element.orderAt ? formatDate(element.orderAt) : "DATE..."}</p>
              <p class="text-[9px] leading-3 font-medium tracking-[0.06px] text-[#666666]" style="font-size: 9px; margin-top: 0; margin-bottom: 0; line-height: 1; font-medium; color: #666666;">MCode - ${element.MCode}</p>
              <p class="text-[9px] leading-3 font-medium tracking-[0.06px] text-[#666666]" style="font-size: 9px; margin-top: 0; margin-bottom: 0; line-height: 1; font-medium; color: #666666;">Part Code - ${element.partCode}</p>
              <p class="text-[9px] leading-3 font-medium tracking-[0.06px] text-[#666666]" style="font-size: 9px; margin-top: 0; margin-bottom: 0; line-height: 1; font-medium; color: #666666;">Work Order No. - #${element.workOrderNumber}</p>
            </div>
          </div>
        </div>
        <div style="margin-top: 0px; margin-bottom: -8px;">
          <table class="w-full table" style="border: 1px solid black;">
            <tbody>
              <tr style="border: 1px solid black;">
                <td class="bg-[#080808] pb-2 px-[18.71px] border border-solid border[#DEDEDE]" style="padding: 8px 20px; font-size: 14px; font-weight: bold; border: 1px solid black; color: #080808; white-space: nowrap;">Finish Item</td>
                <td class="bg-[#FAFAFA] pb-2 px-[18.71px] border border-solid border[#DEDEDE]" style="padding: 8px 20px; font-size: 14px; font-weight: bold; border: 1px solid black; color: #080808; white-space: nowrap;">Production Item</td>
                <td class="bg-[#FAFAFA] pb-2 px-[18.71px] border border-solid border[#DEDEDE]" style="padding: 8px 20px; font-size: 14px; font-weight: bold; border: 1px solid black; color: #080808; white-space: nowrap;">Consumption Items</td>
              </tr>
              <tr style="border: 1px solid black;">
                <td class="pb-2 px-[18.71px] text-[10.92px] font-normal border border-solid border[#DEDEDE]" style="padding: 8px 20px; border: 1px solid black; font-size: 14px; font-weight: bold; color: #080808; white-space: nowrap;">${element.finishItemName.length > 30 ? element.finishItemName.substring(0, 30) + ' ...' : element.finishItemName}</td>
                <td class="px-[18.71px] border border-solid border[#DEDEDE] py-2" style="padding: 8px 20px; font-size: 14px; border: 1px solid black; font-weight: bold; color: #080808; white-space: nowrap;">
                  <div class="flex justify-between items-center production-item" style="display: flex; justify-content: space-between; align-items: center;">
                    <p class="text-[10.92px] font-normal" style="font-size: 10.92px; font-normal;">${element.productionItem.length > 30 ? element.productionItem.substring(0, 30) + "..." : element.productionItem}</p>
                    <div class="flex flex-col justify-center items-center" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                      <input class="w-[53px] h-[22px] border border-solid border-[#DEDEDE] rounded-[3.72px] focus:outline-none" style="height: 22px; width: 53px; border: 1px solid #DEDEDE; border-radius: 3.72px; outline: none;" type="text" />
                      <p class="text-xs font-bold" style="font-size: 11px;">${element.pendingRequirement} NOS</p>
                    </div>
                  </div>
                </td>
                <td class="px-[18.71px] border border-solid border[#DEDEDE] pb-2" style="padding: 8px 20px; border: 1px solid black; font-size: 14px; font-weight: bold; color: #080808; white-space: nowrap;">
                  <div class="flex justify-between items-center consumption-item" key=${index} style="display: flex; justify-content: space-between; align-items: center;">
                    <p class="text-[10.92px] font-normal" style="font-size: 10.92px; font-normal;">${element.consumptionItem.length}</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="flex justify-between items-center footer margin-bottom: -6px; margin-top: -6px;" style="display: flex; justify-content: space-around;">
            <p class="text-[9.3px] leading-3 tracking-[0.06px] text-[#949494]" style="font-size: 9.3px; line-height: 3; tracking: 0.06px; color: #949494;">#${element.productionSlipNumber}</p>
            <p class="text-[9.3px] leading-3 tracking-[0.06px] text-[#949494]" style="font-size: 9.3px; line-height: 3; tracking: 0.06px; color: #949494;">Generated at ${formatDateUTC(element.createdAt)}.</p>
          </div>
          <p class="text-[9.3px] leading-3 tracking-[0.06px] text-[#666666]" style="font-size: 9.3px; margin-bottom: 0; tracking: 0.06px; color: #666666; margin-top: -13px;">Production slip under ${element.shopName} of Chawla Components Pvt. Ltd.</p>
          <div class="" style="border: 1px solid #0d0d0d;margin-top: -3px;"></div>
        </div>
      </div>
    </div>
    `).join('')}`
      const pdfOptions = {
        html,
        fileName,
        directory: 'Documents',
        height: 1048,
      };
      const pdfFile = await RNHTMLtoPDF.convert(pdfOptions);
      const destinationPath = `${RNFS.ExternalStorageDirectoryPath}/Download/${fileName}`;
      const fileExists = await RNFS.exists(destinationPath);
      if (!fileExists) {
        const sourcePath = pdfFile.filePath;
        await RNFS.moveFile(sourcePath, destinationPath);
      }
      const type = 'application/pdf';
      if (Platform.OS === 'android') {
        const base64Data = await RNFS.readFile(destinationPath, 'base64');
        const base64DataWithHeader = `data:application/pdf;base64,${base64Data}`;
        try {
          await Share.open({ title: 'Share PDF', url: base64DataWithHeader, type });
        } catch (error) {
          console.error('Error sharing PDF:', error);
        }
      } else {
        const options = {
          title: 'Share PDF',
          url: destinationPath,
          type: 'application/pdf',
        };
        try {
          const result = await Share.open(options);
          if (result.app) {
            console.log(`Shared via ${result.app}`);
          } else {
            console.log('Shared');
          }
        } catch (error) {
          console.error('Error sharing PDF:', error);
        }
      }
    }
    setIsLoading(false);
    navigation.navigate("dashboard")
  };
  if (allWorkOrderLoading || isLoading) {
    return <Spinner
      visible={allWorkOrderLoading || isLoading}
      textContent={'Loading...'}
      textStyle={{ color: '#FFF' }}
    />;
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} disabled={isLoading} onPress={() => generatePDF(val)}>
        <Text style={styles.text}>Generate PDF</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} disabled={isLoading} onPress={() => sharePDF(val)}>
        <Text style={styles.text}>Share PDF</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#aac',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    color: '#fff',
  },
  button: {
    backgroundColor: '#6c8ee3',
    padding: 15,
    borderRadius: 10,
    margin: 20,
  },
});

export default GenerateSlip;
