
import React, { useContext, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  Search,
  MapPin,
  Globe,
  Phone,
  Star,
  Bell,
  Trash2,
  ExternalLink,
  RefreshCw,
  X,
  Building2,
  Filter,
  ChevronDown,
  Download,
} from "lucide-react";

import axios from "axios";
import { LeadContext } from "@/Context/leadContext";
import { toast } from "react-toastify";

export default function LeadsDashboard() {
  const { backendUrl , getCookie} = useContext(LeadContext);
const token=getCookie('token')
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [websiteFilter, setWebsiteFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  // Reminder
  const [reminderLead, setReminderLead] = useState(null);
  const [reminderDate, setReminderDate] = useState("");

  // Fetch leads
  const getLeads = async () => {
    try {
      setLoading(true);
      console.log(token)
      const response = await axios.get(`${backendUrl}/all-lead`,{headers:{token}});
      console.log(response)
      const data = response.data;

      setLeads(
        Array.isArray(data) ? data : data.leads || data.data || []
      );
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLeads();
  }, [backendUrl]);

  // Reset filters
  const resetFilters = () => {
    setWebsiteFilter("all");
    setRatingFilter("all");
    setSortBy("default");
    setSearch("");
  };

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    // Search
    const matchesSearch = [
      lead.name,
      lead.phone,
      lead.address,
      lead.website,
      lead.rating,
      lead.mapsUrl,
    ].some((value) =>
      String(value || "")
        .toLowerCase()
        .includes(search.toLowerCase().trim())
    );

    // Website
    const hasWebsite = Boolean(
      lead.website && String(lead.website).trim()
    );

    const matchesWebsite =
      websiteFilter === "all" ||
      (websiteFilter === "yes" && hasWebsite) ||
      (websiteFilter === "no" && !hasWebsite);

    // Rating
    const rating = parseFloat(lead.rating);

    const matchesRating =
      ratingFilter === "all" ||
      (ratingFilter === "unrated" && isNaN(rating)) ||
      (ratingFilter !== "unrated" &&
        !isNaN(rating) &&
        rating >= Number(ratingFilter));

    return matchesSearch && matchesWebsite && matchesRating;
  });

  // Sort leads
  filteredLeads.sort((a, b) => {
    if (sortBy === "rating-high") {
      return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
    }

    if (sortBy === "rating-low") {
      return (parseFloat(a.rating) || 0) - (parseFloat(b.rating) || 0);
    }

    if (sortBy === "name-asc") {
      return String(a.name || "").localeCompare(String(b.name || ""));
    }

    if (sortBy === "name-desc") {
      return String(b.name || "").localeCompare(String(a.name || ""));
    }

    return 0;
  });

  // Reminder functions
  const openReminder = (lead) => {
    setReminderLead(lead);

    if (lead.reminder && !Number.isNaN(new Date(lead.reminder).getTime())) {
      const date = new Date(lead.reminder);

      const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16);

      setReminderDate(localDate);
    } else {
      setReminderDate("");
    }
  };

  const closeReminder = () => {
    setReminderLead(null);
    setReminderDate("");
  };

  const saveReminder = async(event, id) => {
    
    event.preventDefault();
      console.log(id)
    console.log(reminderDate)
    console.log(token)
    const  response=await axios.post(`${backendUrl}/set-reminder`,{id,reminderDate}, {headers:{token}} )
    
    if(response.data.success === true){
       toast.success("Reminder set successfully ")
    }
 

    closeReminder();
  };



    const exportToExcel = () => {
    try {
      if (filteredLeads.length === 0) {
        toast.error("No leads available to export");
        return;
      }

      const excelData = filteredLeads.map(
        (lead, index) => ({
          "Sr No": index + 1,
          "Business Name": lead.name || "",
          Phone: String(lead.phone || ""),
          Address: lead.address
            ? lead.address.replace("", "").trim()
            : "",
          Rating: lead.rating || "",
          Website: lead.website || "No Website",
          "Google Maps": lead.mapsUrl || "",
          Reminder: lead.reminder
            ? new Date(lead.reminder).toLocaleString("en-IN")
            : "Not Set",
        })
      );

      // Convert JSON to Excel worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      worksheet["!cols"] = [
        { wch: 8 },
        { wch: 35 },
        { wch: 20 },
        { wch: 55 },
        { wch: 12 },
        { wch: 45 },
        { wch: 55 },
        { wch: 25 },
      ];

      // Keep phone numbers as text
      excelData.forEach((_, index) => {
        const cell = worksheet[`C${index + 2}`];

        if (cell) {
          cell.t = "s";
          cell.v = String(cell.v);
          cell.z = "@";
        }
      });

      // Create workbook
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Business Leads"
      );

      // Generate filename with date
      const date = new Date().toISOString().split("T")[0];

      XLSX.writeFile(
        workbook,
        `Business_Leads_${date}.xlsx`
      );

      toast.success(
        `${filteredLeads.length} leads exported successfully`
      );
    } catch (error) {
      console.error("Excel Export Error:", error);
      toast.error("Failed to export Excel");
    }
  };


  //  Mark not intrested
  const notIntrested = async(id) => {
    if (!window.confirm(" marks this lead as not intrested?")) return;

   const response=await axios.post(`${backendUrl}/not-intrested`,{id},{headers:{token}})
   console.log(response)
  };

 
return (
  <div className="min-h-screen w-full min-w-0 overflow-x-clip bg-[#eeece5] text-neutral-900">

    <main className="mx-auto w-full max-w-[1600px] min-w-0 px-3 py-5 sm:px-6 lg:px-8 lg:py-8">

      {/* ================= HEADER ================= */}

      <header className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

        <div className="min-w-0">

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-neutral-500">
            Lead Management
          </p>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Business Leads
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Manage your scraped business leads and follow-ups.
          </p>

        </div>

        {/* TOTAL BUSINESS COUNTER */}

        <div className="flex shrink-0 items-center gap-3 self-start rounded-xl border border-[#d5d0c3] bg-[#f5f3ec] px-5 py-3 shadow-[inset_2px_2px_2px_#ffffff,inset_-3px_-3px_5px_rgba(0,0,0,0.06),4px_5px_10px_rgba(0,0,0,0.12)] sm:self-auto">

          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#d8c98b] bg-[#fff4b8] shadow-[inset_2px_2px_2px_#ffffff,inset_-2px_-2px_4px_rgba(130,110,40,0.18),2px_3px_5px_rgba(0,0,0,0.1)]">
            <Building2 size={20} />
          </div>

          <div>

            <p className="text-xs font-medium text-neutral-500">
              Total businesses
            </p>

            <p className="text-xl font-bold tabular-nums">
              {leads.length}
            </p>

          </div>

        </div>

      </header>

      {/* ================= BUSINESS DIRECTORY ================= */}

      <section className="w-full min-w-0 overflow-hidden rounded-2xl border border-[#d5d0c3] bg-[#f5f3ec] shadow-[inset_2px_2px_2px_#ffffff,inset_-3px_-3px_6px_rgba(0,0,0,0.05),5px_7px_16px_rgba(0,0,0,0.12)]">

        {/* ================= SEARCH BAR ================= */}

        <div className="flex min-w-0 flex-col gap-5 border-b border-[#d5d0c3] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h2 className="text-lg font-bold">
              Business Directory
            </h2>

            <p className="mt-1 text-xs text-neutral-500">
              Showing {filteredLeads.length} of {leads.length} businesses
            </p>

          </div>

          <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row lg:max-w-[650px]">

            {/* EXPORT EXCEL */}

            <button
              type="button"
              onClick={exportToExcel}
              disabled={leads.length === 0}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-neutral-950 px-5 text-xs font-bold text-white shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2),inset_-2px_-2px_3px_rgba(0,0,0,0.5),3px_4px_6px_rgba(0,0,0,0.16)] transition-all hover:bg-neutral-800 active:translate-y-[2px] active:shadow-inner disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={16} />
              Export Excel
            </button>

            <div className="flex min-w-0 flex-1 gap-2">

              {/* INSET SEARCH */}

              <div className="relative min-w-0 flex-1">

                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search businesses..."
                  className="h-11 w-full min-w-0 rounded-lg border border-[#d7d2c7] bg-[#eeece5] pl-10 pr-3 text-sm outline-none shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_#ffffff] placeholder:text-neutral-400 focus:border-[#c9ae43]"
                />

              </div>

              {/* REFRESH */}

              <button
                type="button"
                onClick={getLeads}
                title="Refresh leads"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#d5d0c3] bg-[#f5f3ec] shadow-[inset_1px_1px_2px_#ffffff,2px_3px_5px_rgba(0,0,0,0.12)] transition-all hover:bg-[#fff4b8] active:translate-y-[2px] active:shadow-inner"
              >
                <RefreshCw size={16} />
              </button>

            </div>

          </div>

        </div>

        {/* ================= FILTERS ================= */}

        <div className="border-b border-[#d5d0c3] bg-[#f0eee7] px-4 py-4 sm:px-5">

          <div className="flex flex-wrap items-center justify-between gap-3">

            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-xs font-bold shadow-[inset_1px_1px_2px_#ffffff,2px_3px_5px_rgba(0,0,0,0.1)] transition-all active:translate-y-[2px] ${
                showFilters
                  ? "border-[#d8c47a] bg-[#fff4b8]"
                  : "border-[#d5d0c3] bg-[#f5f3ec] hover:bg-[#fff4b8]"
              }`}
            >

              <Filter size={15} />

              Filters

              <ChevronDown
                size={14}
                className={`transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />

            </button>

            <div className="flex items-center gap-4">

              <span className="rounded-md border border-[#d5d0c3] bg-[#e9e6dc] px-3 py-1.5 text-xs font-semibold text-neutral-600 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08)]">
                {filteredLeads.length} results
              </span>

              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:text-red-600"
              >
                <RefreshCw size={13} />
                Reset
              </button>

            </div>

          </div>

          {/* FILTER DROPDOWNS */}

          {showFilters && (

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">

              {/* WEBSITE */}

              <div>

                <label className="mb-2 block text-xs font-semibold text-neutral-600">
                  Website
                </label>

                <select
                  value={websiteFilter}
                  onChange={(e) => setWebsiteFilter(e.target.value)}
                  className="h-11 w-full rounded-lg border border-[#d5d0c3] bg-[#eeece5] px-3 text-sm outline-none shadow-[inset_3px_3px_6px_rgba(0,0,0,0.09),inset_-2px_-2px_4px_#ffffff] focus:border-[#c9ae43]"
                >
                  <option value="all">All Businesses</option>
                  <option value="yes">Has Website</option>
                  <option value="no">No Website</option>
                </select>

              </div>

              {/* RATING */}

              <div>

                <label className="mb-2 block text-xs font-semibold text-neutral-600">
                  Minimum Rating
                </label>

                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="h-11 w-full rounded-lg border border-[#d5d0c3] bg-[#eeece5] px-3 text-sm outline-none shadow-[inset_3px_3px_6px_rgba(0,0,0,0.09),inset_-2px_-2px_4px_#ffffff] focus:border-[#c9ae43]"
                >
                  <option value="all">All Ratings</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4">4.0+ Stars</option>
                  <option value="3">3.0+ Stars</option>
                  <option value="2">2.0+ Stars</option>
                  <option value="unrated">Not Rated</option>
                </select>

              </div>

              {/* SORT */}

              <div>

                <label className="mb-2 block text-xs font-semibold text-neutral-600">
                  Sort By
                </label>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-11 w-full rounded-lg border border-[#d5d0c3] bg-[#eeece5] px-3 text-sm outline-none shadow-[inset_3px_3px_6px_rgba(0,0,0,0.09),inset_-2px_-2px_4px_#ffffff] focus:border-[#c9ae43]"
                >
                  <option value="default">Default Order</option>
                  <option value="rating-high">Highest Rating</option>
                  <option value="rating-low">Lowest Rating</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                </select>

              </div>

            </div>

          )}

        </div>

        {/* ================= LOADING / EMPTY ================= */}

        {loading ? (

          <div className="flex min-h-[250px] flex-col items-center justify-center gap-4 bg-[#faf9f5] p-8">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#d5d0c3] bg-[#f5f3ec] shadow-[inset_1px_1px_2px_#ffffff,3px_4px_7px_rgba(0,0,0,0.12)]">

              <RefreshCw size={20} className="animate-spin" />

            </div>

            <p className="text-sm font-medium text-neutral-500">
              Loading businesses...
            </p>

          </div>

        ) : filteredLeads.length === 0 ? (

          <div className="flex min-h-[250px] flex-col items-center justify-center bg-[#faf9f5] p-8 text-center">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#d5d0c3] bg-[#fff4b8] shadow-[inset_2px_2px_2px_#ffffff,3px_4px_6px_rgba(0,0,0,0.12)]">
              <Building2 size={20} />
            </div>

            <p className="text-sm font-bold">
              No businesses found
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              Try changing your search or filters.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 rounded-lg border border-[#d8c47a] bg-[#fff4b8] px-5 py-2.5 text-xs font-bold shadow-[inset_1px_1px_2px_#ffffff,3px_4px_6px_rgba(0,0,0,0.12)] hover:bg-[#ffef9d] active:translate-y-[2px]"
            >
              Clear Filters
            </button>

          </div>

        ) : (

          <>

            {/* ==================================================
                MOBILE VIEW - RESPONSIVE LEAD CARDS
                ================================================== */}

            <div className="grid grid-cols-1 gap-4 bg-[#eeece5] p-3 sm:p-4 lg:hidden">

              {filteredLeads.map((lead, index) => (

                <article
                  key={lead._id || index}
                  className="min-w-0 overflow-hidden rounded-xl border border-[#d5d0c3] bg-[#f8f6ef] p-4 shadow-[inset_2px_2px_2px_#ffffff,inset_-2px_-2px_4px_rgba(0,0,0,0.04),3px_5px_9px_rgba(0,0,0,0.12)]"
                >

                  {/* CARD HEADER */}

                  <div className="flex min-w-0 items-start gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#d8c47a] bg-[#fff4b8] shadow-[inset_2px_2px_2px_#ffffff,inset_-2px_-2px_4px_rgba(130,110,40,0.15),2px_3px_5px_rgba(0,0,0,0.1)]">

                      <Building2 size={19} />

                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="break-words text-sm font-bold leading-5">
                        {lead.name || `Business ${index + 1}`}
                      </p>

                      <p className="mt-1 break-all text-[10px] text-neutral-400">
                        #{index + 1} · {lead._id}
                      </p>

                    </div>

                    {lead.rating && (

                      <span className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-[#d8c47a] bg-[#fff4b8] px-2 py-1.5 text-xs font-bold shadow-[inset_1px_1px_2px_#ffffff,2px_2px_4px_rgba(0,0,0,0.1)]">

                        <Star size={12} className="fill-[#c5a21a] text-[#c5a21a]" />

                        {String(lead.rating).replace(/stars?/i, "").trim()}

                      </span>

                    )}

                  </div>

                  {/* INSET INFORMATION PANEL */}

                  <div className="mt-4 space-y-3 rounded-lg border border-[#e0dcd1] bg-[#eeece5] p-3 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.08),inset_-2px_-2px_4px_#ffffff]">

                    {/* PHONE */}

                    <div className="flex items-start gap-2">

                      <Phone size={14} className="mt-0.5 shrink-0 text-neutral-500" />

                      {lead.phone ? (

                        <a
                          href={`tel:${lead.phone}`}
                          className="min-w-0 break-all text-xs font-semibold text-neutral-800 hover:underline"
                        >
                          {lead.phone}
                        </a>

                      ) : (

                        <span className="text-xs text-neutral-400">
                          Phone unavailable
                        </span>

                      )}

                    </div>

                    {/* ADDRESS */}

                    <div className="flex items-start gap-2">

                      <MapPin size={14} className="mt-0.5 shrink-0 text-neutral-500" />

                      <p className="min-w-0 break-words text-xs leading-5 text-neutral-600">

                        {lead.address
                          ? lead.address.replace("", "").trim()
                          : "Address unavailable"}

                      </p>

                    </div>

                    {/* REMINDER */}

                    <div className="flex items-start gap-2">

                      <Bell size={14} className="mt-0.5 shrink-0 text-neutral-500" />

                      <p className="min-w-0 break-words text-xs text-neutral-600">

                        {lead.reminder
                          ? new Date(lead.reminder).toLocaleString("en-IN")
                          : "Reminder not set"}

                      </p>

                    </div>

                  </div>

                  {/* LINKS */}

                  <div className="mt-4 flex flex-wrap gap-2">

                    {lead.website ? (

                      <a
                        href={lead.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#d5d0c3] bg-[#f5f3ec] px-3 py-2 text-xs font-semibold shadow-[inset_1px_1px_2px_#ffffff,2px_3px_5px_rgba(0,0,0,0.1)] active:translate-y-[2px]"
                      >
                        <Globe size={13} />
                        Website
                        <ExternalLink size={10} />
                      </a>

                    ) : (

                      <span className="inline-flex items-center rounded-lg border border-[#e0dcd1] bg-[#eeece5] px-3 py-2 text-xs font-medium text-red-500 shadow-inner">
                        No Website
                      </span>

                    )}

                    {lead.mapsUrl && (

                      <a
                        href={lead.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#d5d0c3] bg-[#f5f3ec] px-3 py-2 text-xs font-semibold shadow-[inset_1px_1px_2px_#ffffff,2px_3px_5px_rgba(0,0,0,0.1)] active:translate-y-[2px]"
                      >
                        <MapPin size={13} />
                        Maps
                        <ExternalLink size={10} />
                      </a>

                    )}

                  </div>

                  {/* MOBILE ACTIONS */}

                  <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#d5d0c3] pt-4">

                    <button
                      type="button"
                      onClick={() => openReminder(lead)}
                      className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-[#d8c47a] bg-[#fff4b8] px-2 text-xs font-bold shadow-[inset_1px_1px_2px_#ffffff,2px_3px_5px_rgba(0,0,0,0.12)] active:translate-y-[2px] active:shadow-inner"
                    >
                      <Bell size={13} />
                      Reminder
                    </button>

                    <button
                      type="button"
                      onClick={() => notIntrested(lead._id)}
                      className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-[#d5d0c3] bg-[#f5f3ec] px-2 text-xs font-bold text-neutral-600 shadow-[inset_1px_1px_2px_#ffffff,2px_3px_5px_rgba(0,0,0,0.1)] hover:text-red-600 active:translate-y-[2px] active:shadow-inner"
                    >
                      <Trash2 size={13} />
                      Not Interested
                    </button>

                  </div>

                </article>

              ))}

            </div>

            {/* ==================================================
                DESKTOP VIEW - SKEUOMORPHIC TABLE
                ================================================== */}

            <div className="hidden w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain lg:block">

              <table className="w-full min-w-[1200px] table-auto border-collapse text-left">

                <thead className="bg-neutral-950 text-white">

                  <tr>

                    {[
                      "#",
                      "Business",
                      "Phone",
                      "Rating",
                      "Address",
                      "Reminder",
                      "Links",
                      "Actions",
                    ].map((heading) => (

                      <th
                        key={heading}
                        className="whitespace-nowrap border-r border-neutral-800 px-4 py-4 text-[11px] font-bold uppercase tracking-wider last:border-r-0"
                      >
                        {heading}
                      </th>

                    ))}

                  </tr>

                </thead>

                <tbody className="divide-y divide-[#d5d0c3] bg-[#faf9f5]">

                  {filteredLeads.map((lead, index) => (

                    <tr
                      key={lead._id || index}
                      className="align-top transition-colors hover:bg-[#fffdf1]"
                    >

                      {/* NUMBER */}

                      <td className="px-4 py-5">

                        <span className="inline-flex min-w-8 items-center justify-center rounded-md border border-[#d5d0c3] bg-[#eeece5] px-2 py-1.5 text-xs font-bold text-neutral-500 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08)]">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                      </td>

                      {/* BUSINESS */}

                      <td className="max-w-[220px] px-4 py-5">

                        <div className="flex items-start gap-2">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#d8c47a] bg-[#fff4b8] shadow-[inset_1px_1px_2px_#ffffff,2px_3px_5px_rgba(0,0,0,0.1)]">

                            <Building2 size={16} />

                          </div>

                          <div className="min-w-0">

                            <p className="break-words text-sm font-bold">
                              {lead.name || `Business ${index + 1}`}
                            </p>

                            <p className="mt-1 max-w-[170px] break-all text-[10px] text-neutral-400">
                              {lead._id}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* PHONE - FULLY VISIBLE */}

                      <td className="whitespace-nowrap px-4 py-5">

                        {lead.phone ? (

                          <a
                            href={`tel:${lead.phone}`}
                            className="inline-flex w-max items-center gap-2 whitespace-nowrap rounded-lg border border-[#d5d0c3] bg-[#f5f3ec] px-3 py-2.5 text-xs font-semibold text-neutral-700 shadow-[inset_1px_1px_2px_#ffffff,2px_3px_5px_rgba(0,0,0,0.1)] hover:bg-[#fff4b8] active:translate-y-[2px] active:shadow-inner"
                          >

                            <Phone size={13} className="shrink-0" />

                            <span className="whitespace-nowrap tabular-nums">
                              {lead.phone}
                            </span>

                          </a>

                        ) : (

                          <span className="text-xs text-neutral-400">
                            —
                          </span>

                        )}

                      </td>

                      {/* RATING */}

                      <td className="px-4 py-5">

                        {lead.rating ? (

                          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#d8c47a] bg-[#fff4b8] px-3 py-2 text-xs font-bold shadow-[inset_1px_1px_2px_#ffffff,2px_3px_5px_rgba(0,0,0,0.1)]">

                            <Star
                              size={12}
                              className="fill-[#c5a21a] text-[#c5a21a]"
                            />

                            {String(lead.rating).replace(/stars?/i, "").trim()}

                          </span>

                        ) : (

                          <span className="text-xs text-neutral-400">
                            —
                          </span>

                        )}

                      </td>

                      {/* ADDRESS */}

                      <td className="min-w-[190px] max-w-[270px] px-4 py-5">

                        <div className="rounded-lg border border-[#e0dcd1] bg-[#eeece5] px-3 py-2.5 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.08),inset_-2px_-2px_4px_#ffffff]">

                          <p className="break-words text-xs leading-5 text-neutral-600">

                            {lead.address
                              ? lead.address.replace("", "").trim()
                              : "Address unavailable"}

                          </p>

                        </div>

                      </td>

                      {/* REMINDER */}

                      <td className="min-w-[145px] px-4 py-5">

                        {lead.reminder ? (

                          <div className="rounded-lg border border-[#d5d0c3] bg-[#f0eee7] px-3 py-2 text-xs leading-5 text-neutral-600 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.07)]">

                            <Bell size={12} className="mb-1" />

                            {new Date(lead.reminder).toLocaleString("en-IN")}

                          </div>

                        ) : (

                          <span className="text-xs text-neutral-400">
                            Not set
                          </span>

                        )}

                      </td>

                      {/* LINKS */}

                      <td className="px-4 py-5">

                        <div className="flex flex-col items-start gap-2">

                          {lead.website ? (

                            <a
                              href={lead.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Open website"
                              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#d5d0c3] bg-[#f5f3ec] px-3 py-2 text-xs font-semibold shadow-[inset_1px_1px_2px_#ffffff,2px_3px_5px_rgba(0,0,0,0.1)] hover:bg-[#fff4b8] active:translate-y-[2px]"
                            >
                              <Globe size={13} />
                              Website
                              <ExternalLink size={10} />
                            </a>

                          ) : (

                            <span className="rounded-md border border-[#e0dcd1] bg-[#eeece5] px-2 py-1.5 text-xs font-medium text-red-500 shadow-inner">
                              No Website
                            </span>

                          )}

                          {lead.mapsUrl && (

                            <a
                              href={lead.mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Open Google Maps"
                              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#d5d0c3] bg-[#f5f3ec] px-3 py-2 text-xs font-semibold shadow-[inset_1px_1px_2px_#ffffff,2px_3px_5px_rgba(0,0,0,0.1)] hover:bg-[#fff4b8] active:translate-y-[2px]"
                            >
                              <MapPin size={13} />
                              Maps
                              <ExternalLink size={10} />
                            </a>

                          )}

                        </div>

                      </td>

                      {/* ACTIONS */}

                      <td className="px-4 py-5">

                        <div className="flex min-w-[120px] flex-col gap-2">

                          <button
                            type="button"
                            onClick={() => openReminder(lead)}
                            className="inline-flex min-h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#d8c47a] bg-[#fff4b8] px-3 text-xs font-bold shadow-[inset_1px_1px_2px_#ffffff,2px_3px_5px_rgba(0,0,0,0.1)] hover:bg-[#ffef9d] active:translate-y-[2px] active:shadow-inner"
                          >
                            <Bell size={13} />
                            Reminder
                          </button>

                          <button
                            type="button"
                            onClick={() => notIntrested(lead._id)}
                            className="inline-flex min-h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#d5d0c3] bg-[#f5f3ec] px-3 text-xs font-semibold text-neutral-600 shadow-[inset_1px_1px_2px_#ffffff,2px_3px_5px_rgba(0,0,0,0.1)] hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:translate-y-[2px] active:shadow-inner"
                          >
                            <Trash2 size={13} />
                            Not Interested
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </>

        )}

        {/* ================= FOOTER ================= */}

        <div className="flex items-center justify-between gap-3 border-t border-[#d5d0c3] bg-[#f0eee7] px-4 py-4 text-xs font-medium text-neutral-500 sm:px-5">

          <span>
            {filteredLeads.length} businesses displayed
          </span>

          <span className="rounded-md border border-[#d5d0c3] bg-[#e9e6dc] px-3 py-1.5 text-[10px] font-semibold shadow-[inset_2px_2px_4px_rgba(0,0,0,0.07)]">
            {loading ? "Loading" : "Ready"}
          </span>

        </div>

      </section>

    </main>

    {/* ================= REMINDER MODAL ================= */}

    {reminderLead && (

      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-4">

        <div className="my-auto w-full max-w-md rounded-2xl border border-[#d5d0c3] bg-[#f5f3ec] p-5 shadow-[inset_2px_2px_2px_#ffffff,inset_-3px_-3px_5px_rgba(0,0,0,0.06),8px_12px_30px_rgba(0,0,0,0.25)] sm:p-6">

          {/* MODAL HEADER */}

          <div className="mb-5 flex items-start justify-between gap-4">

            <div>

              <h2 className="text-lg font-bold">
                Schedule Reminder
              </h2>

              <p className="mt-1 text-xs text-neutral-500">
                Set a follow-up date and time.
              </p>

            </div>

            <button
              type="button"
              onClick={closeReminder}
              aria-label="Close reminder"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#d5d0c3] bg-[#f5f3ec] shadow-[inset_1px_1px_2px_#ffffff,2px_3px_5px_rgba(0,0,0,0.1)] hover:bg-[#fff4b8] active:translate-y-[2px]"
            >
              <X size={17} />
            </button>

          </div>

          {/* SELECTED BUSINESS */}

          <div className="mb-5 rounded-lg border border-[#dedad0] bg-[#eeece5] p-3 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.09),inset_-2px_-2px_4px_#ffffff]">

            <p className="break-words text-sm font-bold">
              {reminderLead.name || "Business"}
            </p>

            {reminderLead.phone && (

              <p className="mt-1 break-all text-xs text-neutral-500">
                {reminderLead.phone}
              </p>

            )}

          </div>

          {/* REMINDER FORM */}

          <form
            onSubmit={(e) => saveReminder(e, reminderLead._id)}
          >

            <label
              htmlFor="reminder-date"
              className="mb-2 block text-xs font-bold text-neutral-600"
            >
              Reminder date and time
            </label>

            <input
              id="reminder-date"
              type="datetime-local"
              required
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              className="h-12 w-full min-w-0 rounded-lg border border-[#d5d0c3] bg-[#eeece5] px-3 text-sm outline-none shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_#ffffff] focus:border-[#c9ae43]"
            />

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={closeReminder}
                className="h-11 rounded-lg border border-[#d5d0c3] bg-[#f5f3ec] px-5 text-xs font-bold shadow-[inset_1px_1px_2px_#ffffff,2px_3px_5px_rgba(0,0,0,0.1)] hover:bg-white active:translate-y-[2px]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="h-11 rounded-lg border border-[#d8c47a] bg-[#fff4b8] px-5 text-xs font-bold shadow-[inset_1px_1px_2px_#ffffff,2px_3px_5px_rgba(0,0,0,0.12)] hover:bg-[#ffef9d] active:translate-y-[2px] active:shadow-inner"
              >
                Save Reminder
              </button>

            </div>

          </form>

        </div>

      </div>

    )}

  </div>
);

}
