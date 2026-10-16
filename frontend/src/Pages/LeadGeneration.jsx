import React, { useContext, useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Building2,
  ExternalLink,
  Loader2,
  Phone,
  Star,
  Globe,
  FileSpreadsheet,
} from "lucide-react";
import axios from "axios";
import * as XLSX from "xlsx";
import { LeadContext } from "@/Context/LeadContext";
import "../uiverce.css"
import { toast } from "react-toastify";

import {
  saveExcelHandle,
  getExcelHandle,
} from "@/utils/excelStorage";
/* =========================================================
   BUSINESS TYPES
========================================================= */

const businessTypes = [
  "Restaurant",
  "Teacher",
  "Gym",
  "Hotel",
  "Salon",
  "Dental Clinic",
  "Real Estate",
  "Digital Marketing Agency",
  "Clothing Store",
  "Cafe",
  "Coaching Institute",
  "Travel Agency",
];

/* =========================================================
   PLACES
========================================================= */

const places = [
  "Mumbai",
  "Pune",
  "Nagpur",
  "Nashik",
  "Thane",
  "Navi Mumbai",
  "Chhatrapati Sambhajinagar",
  "Kolhapur",
  "Solapur",
  "Amravati",
  "Nanded",
  "Sangli",
  "Satara",
  "Jalgaon",
  "Akola",
  "Latur",
  "Ahmednagar",
  "Ratnagiri",
  "Panvel",
  "Kalyan",
  "Dombivli",
  "Bhiwandi",
  "Ulhasnagar",
  "Ambernath",
  "Badlapur",
  "Vasai-Virar",
  "Nalasopara",
  "Mira Road",
  "Bhayandar",

  "Delhi",
  "New Delhi",
  "Gurugram",
  "Noida",
  "Greater Noida",
  "Ghaziabad",
  "Faridabad",
  "Sonipat",
  "Panipat",

  "Bengaluru",
  "Mysuru",
  "Mangaluru",
  "Hubballi",
  "Dharwad",
  "Belagavi",
  "Davangere",
  "Ballari",
  "Shivamogga",
  "Tumakuru",
  "Udupi",
  "Hassan",
  "Kalaburagi",

  "Chennai",
  "Coimbatore",
  "Madurai",
  "Tiruchirappalli",
  "Salem",
  "Tiruppur",
  "Erode",
  "Vellore",
  "Thoothukudi",
  "Tirunelveli",
  "Thanjavur",
  "Dindigul",
  "Nagercoil",
  "Kanchipuram",
  "Hosur",

  "Hyderabad",
  "Warangal",
  "Nizamabad",
  "Karimnagar",
  "Khammam",
  "Ramagundam",
  "Secunderabad",

  "Visakhapatnam",
  "Vijayawada",
  "Guntur",
  "Nellore",
  "Tirupati",
  "Kurnool",
  "Rajahmundry",
  "Kakinada",
  "Kadapa",
  "Anantapur",
  "Vizianagaram",

  "Kochi",
  "Thiruvananthapuram",
  "Kozhikode",
  "Thrissur",
  "Kollam",
  "Kannur",
  "Alappuzha",
  "Kottayam",
  "Palakkad",
  "Malappuram",
  "Kasaragod",

  "Ahmedabad",
  "Surat",
  "Vadodara",
  "Rajkot",
  "Gandhinagar",
  "Bhavnagar",
  "Jamnagar",
  "Junagadh",
  "Anand",
  "Nadiad",
  "Vapi",
  "Valsad",
  "Bharuch",

  "Jaipur",
  "Jodhpur",
  "Udaipur",
  "Kota",
  "Ajmer",
  "Bikaner",
  "Alwar",
  "Bharatpur",
  "Sikar",
  "Sri Ganganagar",

  "Lucknow",
  "Kanpur",
  "Agra",
  "Varanasi",
  "Prayagraj",
  "Meerut",
  "Bareilly",
  "Mathura",
  "Aligarh",
  "Moradabad",
  "Saharanpur",
  "Gorakhpur",
  "Jhansi",
  "Firozabad",
  "Ayodhya",
  "Muzaffarnagar",

  "Kolkata",
  "Howrah",
  "Durgapur",
  "Asansol",
  "Siliguri",
  "Kharagpur",
  "Bardhaman",
  "Malda",

  "Indore",
  "Bhopal",
  "Jabalpur",
  "Gwalior",
  "Ujjain",
  "Sagar",
  "Dewas",
  "Satna",
  "Ratlam",
  "Rewa",

  "Patna",
  "Gaya",
  "Muzaffarpur",
  "Bhagalpur",
  "Darbhanga",
  "Purnia",
  "Arrah",
  "Begusarai",

  "Bhubaneswar",
  "Cuttack",
  "Rourkela",
  "Berhampur",
  "Sambalpur",
  "Puri",
  "Balasore",

  "Ludhiana",
  "Amritsar",
  "Jalandhar",
  "Patiala",
  "Bathinda",
  "Mohali",
  "Pathankot",
  "Hoshiarpur",

  "Ambala",
  "Hisar",
  "Rohtak",
  "Karnal",
  "Yamunanagar",
  "Panchkula",

  "Ranchi",
  "Jamshedpur",
  "Dhanbad",
  "Bokaro",
  "Deoghar",
  "Hazaribagh",

  "Raipur",
  "Bhilai",
  "Bilaspur",
  "Korba",
  "Durg",
  "Rajnandgaon",

  "Guwahati",
  "Dibrugarh",
  "Silchar",
  "Jorhat",
  "Tinsukia",

  "Dehradun",
  "Haridwar",
  "Rishikesh",
  "Haldwani",
  "Nainital",
  "Roorkee",
  "Rudrapur",
  "Mussoorie",

  "Shimla",
  "Dharamshala",
  "Manali",
  "Solan",
  "Mandi",
  "Baddi",

  "Panaji",
  "Vasco da Gama",
  "Margao",
  "Mapusa",
  "Calangute",
  "Candolim",
  "Anjuna",

  "Srinagar",
  "Jammu",
  "Anantnag",
  "Baramulla",
  "Kathua",

  "Shillong",
  "Imphal",
  "Aizawl",
  "Agartala",
  "Kohima",
  "Itanagar",
  "Gangtok",

  "Chandigarh",
  "Puducherry",
  "Port Blair",
  "Leh",
];

/* =========================================================
   INPUT BOX
========================================================= */

function InputBox({
  icon: Icon,
  value,
  onChange,
  placeholder,
  list,
}) {
  return (
    <div className="relative">
      <Icon
        size={14}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        list={list}
        className="h-10 w-full border border-neutral-200 bg-white pl-9 pr-3 text-xs font-semibold text-neutral-800 outline-none transition placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-900"
      />
    </div>
  );
}

/* =========================================================
   LEAD ROW
========================================================= */

function LeadRow({ lead, index }) {
  const website = lead.website?.trim();

  const websiteUrl = website
    ? website.startsWith("http://") ||
      website.startsWith("https://")
      ? website
      : `https://${website}`
    : null;

 


return (
  <tr
    className="
      mb-4
      grid
      w-full
      min-w-0
      grid-cols-2
      gap-x-3
      gap-y-4
      overflow-hidden
      rounded-2xl
      border
      border-[#d5d0c3]
      bg-[#faf9f5]
      p-4
      shadow-[inset_2px_2px_2px_#ffffff,inset_-2px_-2px_4px_rgba(0,0,0,0.04),4px_5px_10px_rgba(0,0,0,0.1)]
      transition-colors
      duration-200
      hover:bg-[#fffdf1]

      sm:gap-x-5
      sm:p-5

      lg:mb-0
      lg:table-row
      lg:rounded-none
      lg:border-0
      lg:border-b
      lg:border-[#d5d0c3]
      lg:p-0
      lg:shadow-none
    "
  >
    {/* ================= BUSINESS ================= */}

    <td
      className="
        col-span-2
        block
        min-w-0
        border-b
        border-[#e5e1d7]
        pb-4

        lg:table-cell
        lg:border-b-0
        lg:px-4
        lg:py-5
        lg:align-middle
      "
    >
      <div className="flex min-w-0 items-center gap-3">

        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-lg
            border
            border-[#d8c98b]
            bg-[#fff4b8]
            text-neutral-800
            shadow-[inset_2px_2px_2px_rgba(255,255,255,0.95),inset_-3px_-3px_5px_rgba(130,110,40,0.18),3px_4px_6px_rgba(0,0,0,0.12)]
          "
        >
          <Building2 size={18} strokeWidth={2} />
        </div>

        <div className="min-w-0 flex-1">

          <p
            title={lead.name || "Unknown business"}
            className="break-words text-sm font-bold leading-5 text-neutral-900"
          >
            {lead.name || "Unknown business"}
          </p>

          <span
            className="
              mt-1.5
              inline-flex
              rounded
              border
              border-[#dedbd2]
              bg-[#eeece5]
              px-2
              py-0.5
              text-[9px]
              font-bold
              uppercase
              tracking-wider
              text-neutral-500
              shadow-[inset_1px_1px_3px_rgba(0,0,0,0.08)]
            "
          >
            #{String(index + 1).padStart(3, "0")}
          </span>

        </div>

      </div>
    </td>

    {/* ================= ADDRESS ================= */}

    <td
      className="
        col-span-2
        block
        min-w-0

        lg:table-cell
        lg:px-4
        lg:py-5
        lg:align-middle
      "
    >
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 lg:hidden">
        Address
      </p>

      <div
        className="
          flex
          min-w-0
          items-start
          gap-2
          rounded-lg
          border
          border-[#e1ddd3]
          bg-[#f1efe8]
          px-3
          py-3
          shadow-[inset_2px_2px_5px_rgba(0,0,0,0.08),inset_-2px_-2px_4px_rgba(255,255,255,0.9)]
        "
      >
        <MapPin
          size={14}
          className="mt-0.5 shrink-0 text-neutral-500"
        />

        <span
          title={lead.address || "No address"}
          className="min-w-0 flex-1 break-words text-xs font-medium leading-5 text-neutral-600 lg:line-clamp-2"
        >
          {lead.address || "-"}
        </span>

      </div>
    </td>

    {/* ================= PHONE ================= */}

    <td
      className="
        col-span-2
        block
        min-w-0

        sm:col-span-1

        lg:table-cell
        lg:px-4
        lg:py-5
        lg:align-middle
      "
    >
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 lg:hidden">
        Phone
      </p>

      {lead.phone ? (

        <a
          href={`tel:${lead.phone}`}
          className="
            inline-flex
            max-w-full
            items-center
            gap-2
            rounded-lg
            border
            border-[#d9d5c9]
            bg-[#f5f3ec]
            px-3
            py-2.5
            text-xs
            font-semibold
            text-neutral-700
            shadow-[inset_1px_1px_1px_#ffffff,inset_-2px_-2px_3px_rgba(0,0,0,0.04),2px_3px_5px_rgba(0,0,0,0.1)]
            transition-all
            duration-150
            hover:bg-[#fff4b8]
            active:translate-y-[2px]
            active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.12)]
          "
        >
          <Phone
            size={13}
            className="shrink-0 text-neutral-600"
          />

          <span className="min-w-0 break-all tabular-nums sm:whitespace-nowrap">
            {lead.phone}
          </span>

        </a>

      ) : (

        <span className="text-xs text-neutral-400">
          -
        </span>

      )}
    </td>

    {/* ================= RATING ================= */}

    <td
      className="
        col-span-1
        block
        min-w-0

        lg:table-cell
        lg:px-4
        lg:py-5
        lg:align-middle
      "
    >
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 lg:hidden">
        Rating
      </p>

      {lead.rating ? (

        <div
          className="
            inline-flex
            items-center
            gap-1.5
            rounded-lg
            border
            border-[#d7c47a]
            bg-[#fff4b8]
            px-3
            py-2.5
            text-xs
            font-bold
            text-neutral-800
            shadow-[inset_2px_2px_2px_rgba(255,255,255,0.95),inset_-2px_-2px_4px_rgba(150,120,30,0.16),2px_3px_5px_rgba(0,0,0,0.09)]
          "
        >
          <Star
            size={13}
            className="shrink-0 fill-[#c5a21a] text-[#c5a21a]"
          />

          <span className="whitespace-nowrap">
            {lead.rating}
          </span>

        </div>

      ) : (

        <span className="text-xs text-neutral-400">
          -
        </span>

      )}
    </td>

    {/* ================= WEBSITE ================= */}

   
{/* ================= WEBSITE ================= */}

<td className="col-span-1 block min-w-0 lg:table-cell lg:w-[160px] lg:max-w-[160px] lg:px-4 lg:py-5 lg:align-middle">

  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 lg:hidden">
    Website
  </p>

  {websiteUrl ? (

    <a
      href={websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={website}
      className="
        flex
        w-full
        min-w-0
        max-w-[180px]
        items-center
        gap-2
        overflow-hidden
        rounded-lg
        border
        border-[#d9d5c9]
        bg-[#f5f3ec]
        px-3
        py-2.5
        text-xs
        font-semibold
        text-neutral-700
        shadow-[inset_1px_1px_1px_#ffffff,inset_-2px_-2px_3px_rgba(0,0,0,0.04),2px_3px_5px_rgba(0,0,0,0.1)]
        transition-all
        duration-150
        hover:bg-[#fff4b8]
        active:translate-y-[2px]
        active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.12)]
      "
    >
      <Globe
        size={13}
        className="shrink-0 text-neutral-600"
      />

      <span className="block min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
        {website
          .replace(/^https?:\/\//, "")
          .replace(/^www\./, "")
          .replace(/\/$/, "")}
      </span>

      <ExternalLink
        size={11}
        className="shrink-0 text-neutral-500"
      />

    </a>

  ) : (

    <span className="inline-flex whitespace-nowrap rounded-md border border-[#e2ded5] bg-[#f0eee8] px-2.5 py-2 text-xs font-medium text-neutral-400 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.07)]">
      No Website
    </span>

  )}

</td>

    {/* ================= GOOGLE MAPS ================= */}

    <td
      className="
        col-span-2
        block
        min-w-0
        border-t
        border-[#e5e1d7]
        pt-4

        lg:table-cell
        lg:border-t-0
        lg:px-4
        lg:py-5
        lg:align-middle
      "
    >
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 lg:hidden">
        Google Maps
      </p>

      {lead.mapsUrl ? (

        <a
          href={lead.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-lg
            border
            border-neutral-700
            bg-neutral-950
            px-4
            py-2.5
            text-xs
            font-bold
            text-white
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2),inset_-2px_-2px_3px_rgba(0,0,0,0.5),2px_3px_5px_rgba(0,0,0,0.2)]
            transition-all
            duration-150
            hover:bg-neutral-800
            active:translate-y-[2px]
            active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.6)]
          "
        >
          <MapPin
            size={13}
            className="shrink-0 text-[#fff4b8]"
          />

          <span className="whitespace-nowrap">
            Maps
          </span>

          <ExternalLink
            size={11}
            className="shrink-0 text-neutral-300"
          />

        </a>

      ) : (

        <span className="text-xs text-neutral-400">
          -
        </span>

      )}
    </td>

  </tr>
);



}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function LeadGeneration() {

  
/* ==============================================
   MASTER EXCEL FILE
============================================== */

const [excelHandle, setExcelHandle] = useState(null);
const [excelFileName, setExcelFileName] = useState("");
const [isExporting, setIsExporting] = useState(false);

/* ==============================================
   RESTORE PREVIOUSLY SELECTED FILE
============================================== */

useEffect(() => {
  const restoreExcelFile = async () => {
    try {
      const handle = await getExcelHandle();

      if (handle) {
        setExcelHandle(handle);
        setExcelFileName(handle.name);
      }
    } catch (error) {
      console.error("Excel restore error:", error);
    }
  };

  restoreExcelFile();
}, []);

/* ==============================================
   SELECT MASTER EXCEL FILE
============================================== */

const selectExcelFile = async () => {
  if (!window.showSaveFilePicker) {
    toast.error("Use Chrome or Edge to access this feature.");
    return null;
  }

  try {
    const handle = await window.showSaveFilePicker({
      suggestedName: "LeadSpace_Master_Leads.xlsx",

      types: [
        {
          description: "Excel Workbook",

          accept: {
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
              ".xlsx",
            ],
          },
        },
      ],
    });

    await saveExcelHandle(handle);

    setExcelHandle(handle);
    setExcelFileName(handle.name);

    return handle;

  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error);
      toast.error("Unable to select Excel file");
    }

    return null;
  }
};

/* ==============================================
   GENERATE UNIQUE LEAD KEY
============================================== */

const getLeadKey = (lead) => {
  const maps = String(
    lead["Google Maps"] || lead.mapsUrl || ""
  ).trim().toLowerCase();

  if (maps) return `maps:${maps}`;

  const name = String(
    lead.Business || lead.name || ""
  ).trim().toLowerCase();

  const phone = String(
    lead.Phone || lead.phone || ""
  ).replace(/\D/g, "");

  const address = String(
    lead.Address || lead.address || ""
  ).trim().toLowerCase();

  return `business:${name}|${phone}|${address}`;
};

/* ==============================================
   EXPORT AND APPEND LEADS
============================================== */

const exportToExcel = async () => {
  if (isExporting) return;

  if (!leads.length) {
    toast.error("No leads available to export");
    return;
  }

  if (!window.showSaveFilePicker) {
    toast.error("This feature requires Chrome or Edge on HTTPS or localhost.");
    return;
  }

  setIsExporting(true);

  try {
    let handle = excelHandle;

    // First export: select or create a master file.
    if (!handle) {
      handle = await selectExcelFile();

      if (!handle) return;
    }

    // Check permission for an existing saved handle.
    let permission = await handle.queryPermission({
      mode: "readwrite",
    });

    if (permission !== "granted") {
      permission = await handle.requestPermission({
        mode: "readwrite",
      });
    }

    if (permission !== "granted") {
      toast.error("Excel file access permission denied");
      return;
    }

    /* ==========================================
       READ EXISTING EXCEL DATA
    ========================================== */

    const file = await handle.getFile();

    let existingData = [];

    if (file.size > 0) {
      const buffer = await file.arrayBuffer();

      const oldWorkbook = XLSX.read(buffer, {
        type: "array",
      });

      const sheetName = oldWorkbook.SheetNames[0];

      if (sheetName) {
        existingData = XLSX.utils.sheet_to_json(
          oldWorkbook.Sheets[sheetName],
          {
            defval: "",
            raw: false,
          }
        );
      }
    }

    /* ==========================================
       FORMAT NEW LEADS
    ========================================== */

    const newLeads = leads.map((lead) => ({
      Business: lead.name || "",
      Address: lead.address || "",
      Phone: String(lead.phone || ""),
      Rating: lead.rating || "",
      Website: lead.website || "",
      "Google Maps": lead.mapsUrl || "",
    }));

    /* ==========================================
       REMOVE DUPLICATES
    ========================================== */

    const allLeads = [...existingData];

    const existingKeys = new Set(
      existingData.map((lead) => getLeadKey(lead))
    );

    let addedCount = 0;
    let duplicateCount = 0;

    newLeads.forEach((lead) => {
      const key = getLeadKey(lead);

      if (existingKeys.has(key)) {
        duplicateCount++;
        return;
      }

      allLeads.push(lead);

      existingKeys.add(key);

      addedCount++;
    });

    if (addedCount === 0) {
      toast.info("All these leads already exist in your Excel file.");
      return;
    }

    /* ==========================================
       CREATE UPDATED WORKBOOK
    ========================================== */

    const worksheet = XLSX.utils.json_to_sheet(allLeads, {
      header: [
        "Business",
        "Address",
        "Phone",
        "Rating",
        "Website",
        "Google Maps",
      ],
    });

    // Column widths
    worksheet["!cols"] = [
      { wch: 35 },
      { wch: 55 },
      { wch: 20 },
      { wch: 12 },
      { wch: 40 },
      { wch: 65 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Business Leads"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    /* ==========================================
       UPDATE SAME EXCEL FILE
    ========================================== */

    const writable = await handle.createWritable();

    await writable.write(excelBuffer);

    await writable.close();

    toast.success(
      `${addedCount} new leads added! Total: ${allLeads.length}`
    );

    console.log({
      file: handle.name,
      added: addedCount,
      duplicates: duplicateCount,
      total: allLeads.length,
    });

  } catch (error) {
    if (error.name === "AbortError") return;

    console.error("Excel export error:", error);

    toast.error(
      error.message || "Failed to update Excel file"
    );

  } finally {
    setIsExporting(false);
  }
};

  const { backendUrl, getCookie } = useContext(LeadContext);
  const token=getCookie("token")
  const [businessType, setBusinessType] =
    useState("Restaurant");

  const[Limit, setLimit]=useState(10)

  const [place, setPlace] =
    useState("Mumbai");

  const [leads, setLeads] =
    useState([]);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =======================================================
     GET LEADS
  ======================================================= */
   // its basically a search filter

const saveFilters = async () => {
  if (!businessType.trim() || !place.trim() || !Limit) {
    setError("Please enter business type and location.");
    return;
  }

  setIsSaving(true);
  setError("");

  try {
    const response = await axios.get(`${backendUrl}/getlead`, {
      params: {
        business: businessType,
        place: place,
        Limit: Limit,
      },
    });

    if (response?.data?.success === true) {

      const cleanedLeads = (response?.data?.leads || []).map((lead) => ({
        ...lead,

        phone: lead.phone
          ? String(lead.phone).replace(/^0+/, "")
          : "",
      }));

      setLeads(cleanedLeads);

    } else {
      setLeads([]);

      setError(
        response?.data?.error || "Unable to find businesses."
      );
    }

  } catch (e) {
    console.error(e);

    setLeads([]);

    setError(
      e?.response?.data?.error ||
      e?.message ||
      "Something went wrong while fetching leads."
    );

  } finally {
    setIsSaving(false);
  }
};




    /* =======================================================
     SAVE LEADS
  ======================================================= */

  const save=async()=>{
    try{
      setIsSaving(true)
      console.log(leads)
        const response=await axios.post(`${backendUrl}/save-lead`,{"leads":leads},{headers:{token}})
        if(response.data.success === true){
          console.log(response?.data?.leads)
          toast.success(" leads added successfully ")
          setIsSaving(false)
        }
        else{
          toast.error(response.data.error)
          setIsSaving(false)
        }
        
    }
    catch(e){
      console.log(e.message)
      toast.error(e.message)
      isSaving(false)
    }
  }

  // const exportToExcel = () => {
  //   try {
  //     if (leads.length === 0) {
  //       toast.error("No leads available to export");
  //       return;
  //     }

  //     const excelData = leads.map(
  //       (lead, index) => ({
  //         "Sr No": index + 1,
  //         "Business Name": lead.name || "",
  //         Phone: String(lead.phone || ""),
  //         Address: lead.address
  //           ? lead.address.replace("", "").trim()
  //           : "",
  //         Rating: lead.rating || "",
  //         Website: lead.website || "No Website",
  //         "Google Maps": lead.mapsUrl || "",
  //         Reminder: lead.reminder
  //           ? new Date(lead.reminder).toLocaleString("en-IN")
  //           : "Not Set",
  //       })
  //     );

  //     // Convert JSON to Excel worksheet
  //     const worksheet = XLSX.utils.json_to_sheet(excelData);

  //     // Set column widths
  //     worksheet["!cols"] = [
  //       { wch: 8 },
  //       { wch: 35 },
  //       { wch: 20 },
  //       { wch: 55 },
  //       { wch: 12 },
  //       { wch: 45 },
  //       { wch: 55 },
  //       { wch: 25 },
  //     ];

  //     // Keep phone numbers as text
  //     excelData.forEach((_, index) => {
  //       const cell = worksheet[`C${index + 2}`];

  //       if (cell) {
  //         cell.t = "s";
  //         cell.v = String(cell.v);
  //         cell.z = "@";
  //       }
  //     });

  //     // Create workbook
  //     const workbook = XLSX.utils.book_new();

  //     XLSX.utils.book_append_sheet(
  //       workbook,
  //       worksheet,
  //       "Business Leads"
  //     );

  //     // Generate filename with date
  //     const date = new Date().toISOString().split("T")[0];

  //     XLSX.writeFile(
  //       workbook,
  //       `Business_Leads_${date}.xlsx`
  //     );

  //     toast.success(
  //       `${leads.length} leads exported successfully`
  //     );
  //   } catch (error) {
  //     console.error("Excel Export Error:", error);
  //     toast.error("Failed to export Excel");
  //   }
  // };


  useEffect(()=>{
   console.log(leads)
  },[leads])

  /* =======================================================
     UI
  ======================================================= */

 


return (
  <div className="min-h-screen min-w-0 w-full max-w-full overflow-x-hidden bg-[#eae7de] text-neutral-950">

    {/* ================= HEADER ================= */}

    <header className="w-full min-w-0 border-b border-[#c8c4b8] bg-[#f5f3ec] shadow-[0_3px_8px_rgba(0,0,0,0.08)]">

      <div className="mx-auto flex w-full max-w-[1700px] min-w-0 items-center gap-3 px-3 py-4 sm:gap-4 sm:px-5 sm:py-5 lg:px-6">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d5c78a] bg-[#fff4b8] shadow-[inset_2px_2px_2px_rgba(255,255,255,0.95),inset_-3px_-3px_5px_rgba(130,110,40,0.18),3px_4px_7px_rgba(0,0,0,0.15)]">

          <Search size={18} />

        </div>

        <div className="min-w-0 flex-1">

          <h1 className="text-lg font-bold tracking-tight sm:text-xl">
            Lead Generation
          </h1>

          <p className="mt-0.5 text-xs leading-5 text-neutral-500">
            Discover businesses that could use your services.
          </p>

        </div>

      </div>

    </header>

    {/* ================= CONTENT ================= */}

    <main className="w-full min-w-0 max-w-full px-3 py-5 sm:px-5 lg:px-6 lg:py-7">

      <div className="mx-auto w-full min-w-0 max-w-[1700px]">

        {/* ================= SECTION HEADING ================= */}

        <div className="mb-6 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="min-w-0">

            <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-neutral-500">
              Search workspace
            </p>

            <p className="mt-1 text-sm text-neutral-600">
              Enter your target business and location below.
            </p>

          </div>

          {/* ACTION BUTTONS */}

          <div className="grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto sm:shrink-0">

            <button
              type="button"
              onClick={() => save()}
              className="inline-flex h-11 min-w-0 items-center justify-center rounded-lg border border-[#c9b86b] bg-[#fff4b8] px-3 text-xs font-bold text-neutral-950 shadow-[inset_2px_2px_2px_rgba(255,255,255,0.95),inset_-3px_-3px_5px_rgba(140,120,50,0.2),3px_4px_0px_#c6bb86,4px_6px_9px_rgba(0,0,0,0.12)] transition-all hover:bg-[#ffef9b] active:translate-y-[2px] active:shadow-inner sm:min-w-[110px] sm:px-6"
            >
              Save
            </button>

            
<div className="flex min-w-0 flex-col gap-2">

  <button
    type="button"
    onClick={exportToExcel}
    disabled={isExporting}
    className="
      inline-flex
      h-11
      min-w-0
      items-center
      justify-center
      gap-2
      rounded-lg
      border
      border-[#0c9756]
      bg-[#76e091]
      px-4
      text-xs
      font-bold
      text-neutral-950
      shadow-[inset_2px_2px_2px_rgba(255,255,255,0.95),inset_-3px_-3px_5px_rgba(20,110,60,0.2),3px_4px_0px_#479b62,4px_6px_9px_rgba(0,0,0,0.12)]
      transition-all
      hover:bg-[#20df69]
      active:translate-y-[2px]
      active:shadow-inner
      disabled:cursor-not-allowed
      disabled:opacity-60
      sm:px-6
    "
  >

    {isExporting ? (
      <Loader2 size={15} className="animate-spin" />
    ) : (
      <FileSpreadsheet size={15} />
    )}

    {isExporting ? "Updating Excel..." : "Export To Excel"}

  </button>

  {excelFileName && (

    <div className="flex min-w-0 items-center justify-between gap-2">

      <span
        title={excelFileName}
        className="min-w-0 max-w-[170px] truncate text-[10px] font-semibold text-neutral-600"
      >
        {excelFileName}
      </span>

      <button
        type="button"
        onClick={selectExcelFile}
        className="shrink-0 text-[10px] font-bold text-neutral-700 underline underline-offset-2 hover:text-black"
      >
        Change File
      </button>

    </div>

  )}

</div>


          </div>

        </div>

        {/* ================= ERROR ================= */}

        {error && (

          <div className="mb-5 w-full min-w-0 break-words rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-xs font-medium text-red-600 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.06)]">
            {error}
          </div>

        )}

        {/* ================= FILTER PANEL ================= */}

        <div className="mb-6 w-full min-w-0 rounded-xl border border-[#c8c4b8] bg-[#f5f3ec] p-1.5 shadow-[inset_2px_2px_2px_#ffffff,3px_4px_0px_#d1cdc2,4px_7px_12px_rgba(0,0,0,0.1)] sm:p-2">

          <div className="w-full min-w-0 rounded-lg border border-[#d8c986] bg-[#f7f0cf] p-3 sm:p-5">

            {/* FILTER HEADING */}

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

              <div className="min-w-0">

                <p className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-500">
                  Filters
                </p>

                <p className="mt-1 text-sm font-bold text-neutral-800">
                  Target businesses
                </p>

              </div>

              <span className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-[#d3c78c] bg-[#fff4b8] px-3 py-2 text-xs font-bold shadow-[inset_1px_1px_2px_#ffffff,2px_3px_4px_rgba(0,0,0,0.08)]">

                <span className="h-2 w-2 rounded-full bg-[#c9a500]" />

                {leads.length} found

              </span>

            </div>

            {/* FILTER INPUTS */}

            <div className="grid w-full min-w-0 grid-cols-1 items-end gap-4 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1.3fr)_minmax(0,0.7fr)_minmax(120px,0.8fr)]">

              {/* BUSINESS TYPE */}

              <div className="w-full min-w-0">

                <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                  Business Type
                </label>

                <div className="w-full min-w-0 overflow-hidden rounded-lg border border-[#c7bea1] bg-[#eeeadb] p-1 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.12),inset_-2px_-2px_3px_rgba(255,255,255,0.9)]">

                  <InputBox
                    icon={Building2}
                    value={businessType}
                    onChange={setBusinessType}
                    placeholder="Business type"
                    list="business-types"
                  />

                </div>

                <datalist id="business-types">
                  {businessTypes.map((type) => (
                    <option key={type} value={type} />
                  ))}
                </datalist>

              </div>

              {/* LOCATION */}

              <div className="w-full min-w-0">

                <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                  Location
                </label>

                <div className="w-full min-w-0 overflow-hidden rounded-lg border border-[#c7bea1] bg-[#eeeadb] p-1 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.12),inset_-2px_-2px_3px_rgba(255,255,255,0.9)]">

                  <InputBox
                    icon={MapPin}
                    value={place}
                    onChange={setPlace}
                    placeholder="Location"
                    list="places"
                  />

                </div>

                <datalist id="places">
                  {places.map((placeName) => (
                    <option key={placeName} value={placeName} />
                  ))}
                </datalist>

              </div>

              {/* LIMIT */}

              <div className="w-full min-w-0">

                <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                  Limit
                </label>

                <div className="w-full min-w-0 overflow-hidden rounded-lg border border-[#c7bea1] bg-[#eeeadb] p-1 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.12),inset_-2px_-2px_3px_rgba(255,255,255,0.9)]">

                  <InputBox
                    icon={Building2}
                    value={Limit}
                    onChange={setLimit}
                    placeholder="Limit"
                  />

                </div>

              </div>

              {/* SEARCH BUTTON */}

              <button
                type="button"
                onClick={saveFilters}
                disabled={isSaving}
                className="inline-flex h-12 w-full min-w-0 items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-neutral-950 px-4 text-xs font-bold text-white shadow-[inset_2px_2px_2px_rgba(255,255,255,0.2),inset_-3px_-3px_4px_rgba(0,0,0,0.6),2px_3px_0px_#777,3px_5px_7px_rgba(0,0,0,0.2)] transition-all hover:bg-neutral-800 active:translate-y-[2px] active:shadow-inner disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 xl:col-span-1"
              >

                {isSaving && (
                  <Loader2 size={14} className="animate-spin" />
                )}

                {isSaving ? "Searching..." : "Search"}

              </button>

            </div>

          </div>

        </div>

        {/* ================= RESULTS FRAME ================= */}

        <section className="w-full min-w-0 max-w-full rounded-xl border border-[#c8c4b8] bg-[#f5f3ec] p-[5px] shadow-[inset_2px_2px_2px_#ffffff,3px_5px_0px_#d1cdc2,5px_8px_14px_rgba(0,0,0,0.12)]">

          <div className="w-full min-w-0 overflow-hidden rounded-lg border border-[#d3d0c6] bg-[#faf9f5]">

            {/* RESULTS HEADER */}

            <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 border-b-4 border-[#3a3a3a] bg-neutral-950 px-4 py-4 text-white shadow-[inset_0_2px_2px_rgba(255,255,255,0.15),inset_0_-4px_5px_rgba(0,0,0,0.5)]">

              <p className="text-xs font-bold uppercase tracking-[0.1em]">
                Business Results
              </p>

              <span className="text-xs font-semibold text-[#fff4b8]">
                {leads.length} businesses
              </span>

            </div>

            {/* ============================================
                DESKTOP TABLE
                ============================================ */}

            <div className="hidden w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain lg:block">

              <table className="w-full min-w-[1150px] table-auto border-collapse text-left">

                <thead>

                  <tr className="border-b-2 border-[#d8c986] bg-[#f7f0cf]">

                    <th className="w-[19%] px-4 py-4 text-left text-[10px] font-bold uppercase tracking-wider">
                      Business
                    </th>

                    <th className="w-[25%] px-4 py-4 text-left text-[10px] font-bold uppercase tracking-wider">
                      Address
                    </th>

                    <th className="min-w-[175px] px-4 py-4 text-left text-[10px] font-bold uppercase tracking-wider">
                      Phone
                    </th>

                    <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-wider">
                      Rating
                    </th>

                    <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-wider">
                      Website
                    </th>

                    <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-wider">
                      Google Maps
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-[#e5e1d7] bg-[#faf9f5]">

                  {isSaving ? (

                    <tr>

                      <td colSpan={6} className="h-[280px] text-center">

                        <Loader2
                          size={25}
                          className="mx-auto animate-spin"
                        />

                        <p className="mt-4 text-sm font-bold">
                          Finding businesses
                        </p>

                        <p className="mt-1 text-xs text-neutral-500">
                          Searching {businessType} in {place}
                        </p>

                      </td>

                    </tr>

                  ) : leads.length > 0 ? (

                    leads.map((lead, index) => (

                      <LeadRow
                        key={lead.mapsUrl || `${lead.name}-${index}`}
                        lead={lead}
                        index={index}
                      />

                    ))

                  ) : (

                    <tr>

                      <td colSpan={6} className="h-[280px] text-center">

                        <Building2
                          size={24}
                          className="mx-auto text-neutral-500"
                        />

                        <p className="mt-4 text-sm font-bold">
                          No businesses found
                        </p>

                        <p className="mt-1 text-xs text-neutral-500">
                          Search for a business category and location.
                        </p>

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

            {/* ============================================
                MOBILE / TABLET CARDS
                ============================================ */}

            <div className="block w-full min-w-0 p-3 sm:p-4 lg:hidden">

              {isSaving ? (

                <div className="flex min-h-[250px] flex-col items-center justify-center text-center">

                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#d5c78a] bg-[#fff4b8] shadow-[inset_2px_2px_2px_#ffffff,3px_4px_6px_rgba(0,0,0,0.12)]">

                    <Loader2 size={22} className="animate-spin" />

                  </div>

                  <p className="mt-5 text-sm font-bold">
                    Finding businesses
                  </p>

                  <p className="mt-1 break-words text-xs text-neutral-500">
                    Searching {businessType} in {place}
                  </p>

                </div>

              ) : leads.length > 0 ? (

                <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">

                  {leads.map((lead, index) => {

                    const website = lead.website || "";

                    const websiteUrl = website
                      ? website.startsWith("http")
                        ? website
                        : `https://${website}`
                      : "";

                    return (

                      <article
                        key={lead.mapsUrl || `${lead.name}-${index}`}
                        className="w-full min-w-0 overflow-hidden rounded-xl border border-[#d2cec2] bg-[#f5f3ec] p-3 shadow-[inset_2px_2px_2px_#ffffff,inset_-2px_-2px_3px_rgba(0,0,0,0.05),3px_4px_0px_#d1cdc2,5px_7px_10px_rgba(0,0,0,0.1)]"
                      >

                        {/* BUSINESS HEADER */}

                        <div className="mb-4 flex min-w-0 items-start gap-3">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#d8c98b] bg-[#fff4b8] shadow-[inset_2px_2px_2px_#ffffff,inset_-3px_-3px_5px_rgba(130,110,40,0.18),3px_4px_6px_rgba(0,0,0,0.12)]">

                            <Building2 size={18} />

                          </div>

                          <div className="min-w-0 flex-1">

                            <p className="break-words text-sm font-bold leading-5">
                              {lead.name || "Unknown business"}
                            </p>

                            <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                              #{String(index + 1).padStart(3, "0")}
                            </p>

                          </div>

                          {lead.rating && (

                            <div className="flex shrink-0 items-center gap-1 rounded-lg border border-[#d7c47a] bg-[#fff4b8] px-2 py-1.5 text-xs font-bold shadow-[inset_1px_1px_2px_#ffffff,2px_3px_4px_rgba(0,0,0,0.08)]">

                              <Star
                                size={12}
                                className="fill-[#c5a21a] text-[#c5a21a]"
                              />

                              {lead.rating}

                            </div>

                          )}

                        </div>

                        {/* ADDRESS */}

                        <div className="mb-3 min-w-0 rounded-lg border border-[#e1ddd3] bg-[#eeece5] p-3 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.08),inset_-2px_-2px_4px_#ffffff]">

                          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                            Address
                          </p>

                          <div className="flex min-w-0 items-start gap-2">

                            <MapPin
                              size={14}
                              className="mt-0.5 shrink-0 text-neutral-500"
                            />

                            <p className="min-w-0 flex-1 break-words text-xs leading-5 text-neutral-700">
                              {lead.address || "No address available"}
                            </p>

                          </div>

                        </div>

                        {/* PHONE */}

                        <div className="mb-4 min-w-0">

                          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                            Phone Number
                          </p>

                          {lead.phone ? (

                            <a
                              href={`tel:${lead.phone}`}
                              className="inline-flex max-w-full items-center gap-2 rounded-lg border border-[#d9d5c9] bg-white px-3 py-2.5 text-xs font-bold text-neutral-800 shadow-[inset_1px_1px_1px_#ffffff,2px_3px_5px_rgba(0,0,0,0.1)]"
                            >

                              <Phone size={14} className="shrink-0" />

                              <span className="min-w-0 break-all tabular-nums">
                                {lead.phone}
                              </span>

                            </a>

                          ) : (

                            <p className="text-xs text-neutral-400">
                              Not available
                            </p>

                          )}

                        </div>

                        {/* ACTION BUTTONS */}

                        <div className="grid min-w-0 grid-cols-2 gap-2 border-t border-[#d8d4c9] pt-3">

                          {websiteUrl ? (

                            <a
                              href={websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex min-w-0 items-center justify-center gap-1.5 rounded-lg border border-[#d9d5c9] bg-white px-2 py-3 text-[11px] font-bold shadow-[inset_1px_1px_1px_#ffffff,2px_3px_5px_rgba(0,0,0,0.1)] transition-all active:translate-y-[2px]"
                            >

                              <Globe size={13} className="shrink-0" />

                              Website

                              <ExternalLink size={10} className="shrink-0" />

                            </a>

                          ) : (

                            <div className="flex min-w-0 items-center justify-center rounded-lg border border-[#dedbd2] bg-[#eeece5] px-2 py-3 text-center text-[11px] font-semibold text-neutral-400">
                              No Website
                            </div>

                          )}

                          {lead.mapsUrl ? (

                            <a
                              href={lead.mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex min-w-0 items-center justify-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-950 px-2 py-3 text-[11px] font-bold text-white shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2),2px_3px_5px_rgba(0,0,0,0.2)] transition-all active:translate-y-[2px]"
                            >

                              <MapPin
                                size={13}
                                className="shrink-0 text-[#fff4b8]"
                              />

                              Maps

                              <ExternalLink size={10} className="shrink-0" />

                            </a>

                          ) : (

                            <div className="flex min-w-0 items-center justify-center rounded-lg border border-[#dedbd2] bg-[#eeece5] px-2 py-3 text-center text-[11px] font-semibold text-neutral-400">
                              No Maps
                            </div>

                          )}

                        </div>

                      </article>

                    );
                  })}

                </div>

              ) : (

                <div className="flex min-h-[250px] flex-col items-center justify-center text-center">

                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#d5c78a] bg-[#fff4b8] shadow-[inset_2px_2px_2px_#ffffff,3px_4px_6px_rgba(0,0,0,0.12)]">

                    <Building2 size={21} />

                  </div>

                  <p className="mt-5 text-sm font-bold">
                    No businesses found
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    Search for a business category and location.
                  </p>

                </div>

              )}

            </div>

            {/* ================= FOOTER ================= */}

            <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 border-t border-[#d4d0c5] bg-[#f0eee7] px-4 py-4 shadow-[inset_0_2px_3px_rgba(255,255,255,0.9)] sm:px-5">

              <p className="text-[11px] font-medium text-neutral-600">
                Showing {leads.length} businesses
              </p>

              <div className="flex shrink-0 items-center gap-2 rounded-lg border border-[#c9c5b9] bg-[#e9e6dc] px-3 py-1.5 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_3px_#ffffff]">

                <span
                  className={`h-2 w-2 rounded-full ${
                    isSaving
                      ? "animate-pulse bg-[#d9bd32]"
                      : "bg-[#b8a020]"
                  }`}
                />

                <span className="text-[11px] font-bold text-neutral-700">
                  {isSaving ? "Searching" : "Ready"}
                </span>

              </div>

            </div>

          </div>

        </section>

      </div>

    </main>

  </div>
);


}