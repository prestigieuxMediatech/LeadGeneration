
import React, { useContext, useEffect, useState } from "react";
import {
  MessageCircle,
  QrCode,
  Smartphone,
  RefreshCw,
  LogOut,
  CheckCircle2,
  Wifi,
  ShieldCheck,
  LogOutIcon,
} from "lucide-react";

import axios from "axios";
import { toast } from "react-toastify";
import { LeadContext } from "@/Context/LeadContext";

const WhatsAppConnect = () => {
    const{backendUrl}=useContext(LeadContext)
    const[qr, setQr]=useState('')
    const[connected, setConnected]=useState()



    const getQr= async()=>{
      
        try{
            const response=await axios.get(`${backendUrl}/getqr`)
            console.log( response)
            setQr(response.data.qr)
        }
        catch(e){
            console.log(e.message)
        }
    }

    const getStatus=async()=>{
      try{
        console.log("hii dady bolte ")
        
        const response= await axios.get(`${backendUrl}/getstatus`,)
        console.log(response.data.data)
        setConnected(response.data.data)

      
      }
      catch(e){
        console.log(e)
      }
    }

    const logout=async()=>{
          try{
            const response=await axios.get(`${backendUrl}/logout`)
           console.log(response)
           if(response.data.success == true){
            toast.success(" logout successfully ")
            window.location.reload()
           }
        }
        catch(e){
            console.log(e.message)
            toast.error(e.message)
        }
    }


    const reconnect=async()=>{
      try{
        const response=await axios.get(`${backendUrl}/reconnect`)
        console.log(response)
        if(response.data.success == true ){
          window.location.reload()
        }
      }
      catch(e){
        console.log(e.message)
        toast.error(e.message)
      }
    }


    useEffect(()=>{
      console.log(connected)
    },[connected])

    useEffect(()=>{
        getQr()
    },[])



    useEffect(()=>{
      getStatus()
    },[])

 
return (
  <div className="w-full px-2 sm:px-0">
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">

      {/* ================= HEADER ================= */}
      <div className="border-b border-gray-100 pb-5">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          {/* Title */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 sm:h-11 sm:w-11">
              <MessageCircle
                size={22}
                className="text-green-600 sm:size-24"
              />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-gray-900 sm:text-lg">
                WhatsApp Connection
              </h2>

              <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                Connect your WhatsApp account to send invoices
              </p>
            </div>
          </div>

          {/* Status + Logout */}
          <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">

            {/* Connected Status */}
            <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" />

              <p className="text-sm font-bold text-green-700 sm:text-base">
                {connected?.status}
              </p>
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={logout}
              className="flex h-10 items-center justify-center gap-2 rounded-lg bg-red-500 px-4 text-sm font-bold text-white shadow-md shadow-red-200 transition hover:bg-red-600 active:scale-95 sm:h-11"
            >
              <LogOutIcon size={17} />
              <span>Logout</span>
            </button>

          </div>
        </div>
      </div>

      {/* ================= CONNECTED CONTENT ================= */}
      <div className="flex flex-col items-center py-6 sm:py-8">

        {/* Icon */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
          <QrCode
            size={24}
            className="text-green-600"
          />
        </div>

        <h3 className="text-center text-base font-semibold text-gray-900 sm:text-lg">
          WhatsApp Connected
        </h3>

        <p className="mt-1 max-w-md px-2 text-center text-xs leading-5 text-gray-500 sm:text-sm">
          Your WhatsApp account is connected and ready to
          send invoices and documents.
        </p>

        {/* ================= PHONE NUMBER ================= */}
        <div className="mt-6 w-full max-w-md">
          <div className="flex items-center gap-3 rounded-xl border border-green-100 bg-green-50/60 p-4">

            {/* Icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
              <Smartphone
                size={19}
                className="text-green-600"
              />
            </div>

            {/* Number */}
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                Connected Phone Number
              </p>

              <p className="mt-0.5 truncate text-sm font-bold text-gray-800 sm:text-base">
                {connected?.phone}
              </p>
            </div>

            {/* Active */}
            <div className="shrink-0 rounded-full bg-green-100 px-2.5 py-1">
              <span className="text-[10px] font-semibold text-green-700 sm:text-xs">
                Active
              </span>
            </div>

          </div>
        </div>

        {/* ================= QR CODE ================= */}
        <div className="mt-6 w-full max-w-sm">

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3 sm:p-4">

            <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-white p-3 sm:p-5">

              {qr ? (
                <img
                  src={qr}
                  alt="WhatsApp QR Code"
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="px-4 text-center">
                  <QrCode
                    size={70}
                    strokeWidth={1.2}
                    className="mx-auto text-gray-300 sm:size-20"
                  />

                  <p className="mt-3 text-xs text-gray-400 sm:text-sm">
                    Waiting for QR Code
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* Refresh */}
          <button
          onClick={()=>{
            reconnect()
          }}
            type="button"
            className="mx-auto mt-4 flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 active:scale-95 sm:text-sm"
          >
            <RefreshCw size={15} />
            Refresh QR
          </button>

        </div>

        {/* ================= STEPS ================= */}
        <div className="mt-7 w-full max-w-md space-y-3">

          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 sm:p-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white">
              <Smartphone
                size={16}
                className="text-gray-600"
              />
            </div>

            <p className="text-xs text-gray-600 sm:text-sm">
              Open WhatsApp on your phone
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 sm:p-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-gray-600">
              2
            </div>

            <p className="text-xs text-gray-600 sm:text-sm">
              Go to Linked Devices
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 sm:p-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-gray-600">
              3
            </div>

            <p className="text-xs text-gray-600 sm:text-sm">
              Scan the QR code
            </p>
          </div>

        </div>

        {/* ================= SECURITY ================= */}
        <div className="mt-6 flex w-full max-w-md items-start gap-2 rounded-xl bg-blue-50 px-3 py-3 sm:px-4">

          <ShieldCheck
            size={17}
            className="mt-0.5 shrink-0 text-blue-600"
          />

          <p className="text-[11px] leading-5 text-blue-700 sm:text-xs">
            Your WhatsApp session is securely connected to
            your invoice application.
          </p>

        </div>

      </div>
    </div>
  </div>
);

};

export default WhatsAppConnect;
