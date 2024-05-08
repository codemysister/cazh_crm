import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import DashboardLayout from "@/Layouts/DashboardLayout";
import HeaderModule from "@/Components/HeaderModule";
import { InputText } from "primereact/inputtext";
import { router, useForm, usePage } from "@inertiajs/react";
import {
    ConfirmDialog,
    ConfirmDialog as ConfirmDialog2,
    confirmDialog,
} from "primereact/confirmdialog";
import { Link } from "@inertiajs/react";
import { FilterMatchMode } from "primereact/api";
import { Dialog } from "primereact/dialog";
import { OverlayPanel } from "primereact/overlaypanel";
import { ProgressSpinner } from "primereact/progressspinner";
import { Badge } from "primereact/badge";
import { MultiSelect } from "primereact/multiselect";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import axios from "axios";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import "filepond/dist/filepond.min.css";
import getViewportSize from "../../Utils/getViewportSize";
import { formateDate } from "../../Utils/formatDate";
import HeaderDatatable from "@/Components/HeaderDatatable";
import SkeletonDatatable from "@/Components/SkeletonDatatable";
import { Sidebar } from "primereact/sidebar";
import { TabPanel, TabView } from "primereact/tabview";
import { formatNPWP } from "../../Utils/formatNPWP";
registerPlugin(FilePondPluginFileValidateSize);

export default function InvoiceSubscription({
    auth,
    partnersProp,
    signaturesProp,
    statusProp,
    usersProp,
}) {
    const [invoiceSubscriptions, setInvoiceSubscriptions] = useState([]);
    const [partners, setPartners] = useState(partnersProp);
    const [signatures, setSignatures] = useState(signaturesProp);
    const [status, setStatus] = useState(statusProp);
    const [users, setUsers] = useState(usersProp);
    const [selectedPartners, setSelectedPartners] = useState(partnersProp);
    const action = useRef(null);
    const [invoiceBills, setInvoiceBills] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [selectedInvoices, setSelectedInvoices] = useState([]);
    const [rowClick, setRowClick] = useState(true);
    const viewportSize = getViewportSize();
    const isMobile = viewportSize.width < 992;
    const [confirmIsVisible, setConfirmIsVisible] = useState(false);
    const [dataXendit, setDataXendit] = useState(null);
    const [selectedInvoiceSubscription, setSelectedInvoiceSubscription] =
        useState(null);
    const [activeIndexTab, setActiveIndexTab] = useState(0);
    const btnFilterRef = useRef(null);
    const [sidebarFilter, setSidebarFilter] = useState(null);
    const windowEscapeRef = useRef(null);

    const [modalTransactionIsVisible, setModalTransactionIsVisible] =
        useState(false);
    const [modalEditTransactionIsVisible, setModalEditTransactionIsVisible] =
        useState(false);
    const [modalBundleIsVisible, setModalBundleIsVisible] = useState(false);
    const op = useRef(null);
    const add = useRef(null);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const toast = useRef(null);
    const { roles, permissions } = auth.user;
    const [expandedRows, setExpandedRows] = useState(null);
    useState(false);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [filtersPartner, setFiltersPartner] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [globalFilterPartnerValue, setGlobalFilterPartnerValue] =
        useState("");
    const onGlobalFilterPartnerChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filtersPartner };

        _filters["global"].value = value;

        setFilters(_filters);
        setGlobalFilterPartnerValue(value);
    };

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        reset,
        processing,
        errors,
    } = useForm({
        partner: {
            excell: null,
            signature: {
                name: null,
                image: null,
            },
        },
        signature: {
            name: null,
            image: null,
        },
        date: null,
        due_date: null,
        period_subscription: null,
        selectedPartners: null,
        excel: null,
    });

    const {
        data: dataTransaction,
        setData: setDataTransaction,
        post: postTransaction,
        put: putTransaction,
        delete: destroyTransaction,
        reset: resetTransaction,
        processing: processingTransaction,
        errors: errorsTransaction,
    } = useForm({
        id: "",
        invoice_subscription: null,
        partner: {
            id: null,
            name: null,
        },
        signature: {
            name: null,
            image: null,
        },
        date: null,
        nominal: null,
        money: null,
        payment_for: null,
        metode: null,
        rest_bill: null,
    });

    const {
        data: dataFilter,
        setData: setDataFilter,
        reset: resetFilter,
    } = useForm({
        user: null,
        input_date: { start: null, end: null },
        payment_metode: null,
    });

    useEffect(() => {
        if (activeIndexTab == 0) {
            fetchData(getInvoiceSubscriptions);
        }
    }, [activeIndexTab]);

    const fetchData = async (fnc) => {
        try {
            await Promise.all([fnc()]);
            setIsLoadingData(false);
            setPreRenderLoad((prev) => (prev = false));
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData(getInvoiceSubscriptions);
    }, []);

    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters["global"].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const columns = [
        { field: "code", header: "Kode", type: "regular", width: "6rem" },
        { field: "date", header: "Tanggal", type: "date", width: "6rem" },
        {
            field: "due_date",
            header: "Jatuh Tempo",
            type: "date",
            width: "8rem",
        },
        {
            field: "partner_province",
            header: "Provinsi",
            type: "location",
            width: "8rem",
        },
        {
            field: "partner_regency",
            header: "Kabupaten",
            type: "location",
            width: "8rem",
        },
        {
            field: "partner_phone_number",
            header: "No Telepon",
            type: "regular",
            width: "6rem",
        },
        {
            field: "bill_date",
            header: "Tanggal Pembayaran",
            type: "date",
            width: "12rem",
        },
        {
            field: "total_nominal",
            header: "Sub Total (include pajak)",
            type: "price",
            width: "12rem",
        },
        // {
        //     field: "total_ppn",
        //     header: "Pajak",
        //     type: "price",
        //     width: "8rem",
        // },
        {
            field: "paid_off",
            header: "Uang Muka",
            type: "price",
            width: "8rem",
        },
        {
            field: "total_bill",
            header: "Total Tagihan",
            type: "price",
            width: "8rem",
        },
        {
            field: "rest_of_bill",
            header: "Sisa Tagihan (include uang muka)",
            type: "price",
            width: "8rem",
        },
        {
            field: "payment_metode",
            header: "Metode Pembayaran",
            type: "regular",
            width: "12rem",
        },
        {
            field: "xendit_link",
            header: "Link Xendit",
            type: "regular",
            width: "8rem",
        },
        {
            field: "reason_late",
            header: "Alasan Terlewat",
            type: "regular",
            width: "10rem",
        },
    ];

    const [visibleColumns, setVisibleColumns] = useState([
        { field: "code", header: "Kode", type: "regular", width: "6rem" },
        { field: "date", header: "Tanggal", type: "date", width: "6rem" },
        {
            field: "due_date",
            header: "Jatuh Tempo",
            type: "date",
            width: "8rem",
        },
        {
            field: "bill_date",
            header: "Tanggal Pembayaran",
            type: "date",
            width: "12rem",
        },
        {
            field: "total_nominal",
            header: "Sub Total (include pajak)",
            type: "price",
            width: "12rem",
        },
        // {
        //     field: "total_ppn",
        //     header: "Pajak",
        //     type: "price",
        //     width: "8rem",
        // },
        {
            field: "paid_off",
            header: "Uang Muka",
            type: "price",
            width: "8rem",
        },
        {
            field: "total_bill",
            header: "Total Tagihan",
            type: "price",
            width: "8rem",
        },
        {
            field: "rest_of_bill",
            header: "Sisa Tagihan",
            type: "price",
            width: "8rem",
        },
        {
            field: "payment_metode",
            header: "Metode Pembayaran",
            type: "regular",
            width: "12rem",
        },
        {
            field: "xendit_link",
            header: "Link Xendit",
            type: "regular",
            width: "15rem",
        },
    ]);

    const handleSelectedDetailPartner = (partner) => {
        router.get(`/partners?uuid=${partner.uuid}`);
    };

    const getInvoiceSubscriptions = async () => {
        setIsLoadingData(true);

        let response = await fetch("/api/invoice_subscriptions");
        let data = await response.json();

        setInvoiceSubscriptions((prev) => data);

        setIsLoadingData(false);
    };

    const convertRupiah = async (nominal) => {
        const options = {
            method: "GET",
            url: `/api/convert/rupiah?nominal=${nominal}`,
            headers: {
                "Content-Type": "application/json",
            },
        };

        try {
            const response = await axios.request(options);
            const converted = response.data;
            setDataTransaction((data) => ({
                ...dataTransaction,
                nominal: nominal,
                money: converted,
            }));
        } catch (error) {
            console.log(error);
        }
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <i
                    className="pi pi-ellipsis-h pointer cursor-pointer"
                    onClick={(event) => {
                        setSelectedInvoiceSubscription(rowData);
                        action.current.toggle(event);
                    }}
                ></i>
            </React.Fragment>
        );
    };

    // fungsi toast
    const showSuccess = (type) => {
        toast.current.show({
            severity: "success",
            summary: "Success",
            detail: `${type} data berhasil`,
            life: 3000,
        });
    };

    const showError = (message) => {
        toast.current.show({
            severity: "error",
            summary: "Error",
            detail: message,
            life: 3000,
        });
    };

    const handleEditTransaction = (transaction) => {
        setDataTransaction({
            ...dataTransaction,
            uuid: transaction.uuid,
            invoice_subscription: transaction.invoice_id,
            partner: {
                id: transaction.partner_id,
                name: transaction.partner_name,
            },
            date: transaction.date,
            nominal: transaction.nominal,
            money: transaction.money,
            metode: transaction.metode,
            payment_for: transaction.payment_for,
            signature: {
                name: transaction.signature_name,
                image: transaction.signature_image,
            },
        });
    };

    const handleDeleteInvoiceSubscription = (invoice_subscription) => {
        confirmDialog({
            message: "Apakah Anda yakin untuk menghapus ini?",
            header: "Konfirmasi hapus",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                destroy("invoice_subscriptions/" + invoice_subscription.uuid, {
                    onSuccess: () => {
                        getInvoiceSubscriptions();
                        showSuccess("Hapus");
                    },
                    onError: () => {
                        showError("Hapus");
                    },
                });
            },
        });
    };
    const handleDeleteTransaction = (invoice_subscription) => {
        confirmDialog({
            message: "Apakah Anda yakin untuk menghapus ini?",
            header: "Konfirmasi hapus",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                axios
                    .delete(
                        "invoice_subscriptions/transaction/" +
                            invoice_subscription.uuid,

                        {
                            headers: {
                                "X-CSRF-TOKEN": document.head.querySelector(
                                    'meta[name="csrf-token"]'
                                ).content,
                            },
                        }
                    )
                    .then((response) => {
                        if (response.data.error) {
                            showError(response.data.error);
                        } else {
                            showSuccess("Tambah");
                            setModalTransactionIsVisible((prev) => false);

                            getInvoiceSubscriptions();
                            resetTransaction(
                                "nominal",
                                "date",
                                "money",
                                "payment_for",
                                "metode",
                                "signature"
                            );
                            setDataTransaction((prev) => ({
                                ...prev,
                                rest_bill: response.data.rest_of_bill,
                            }));
                        }
                    });
            },
        });
    };

    const onColumnToggle = (event) => {
        let selectedColumns = event.value;
        let orderedSelectedColumns = columns.filter((col) =>
            selectedColumns.some((sCol) => sCol.field === col.field)
        );

        setVisibleColumns(orderedSelectedColumns);
    };

    const addButtonIcon = () => {
        return (
            <i
                className="pi pi-plus"
                style={{ fontSize: "0.7rem", paddingRight: "5px" }}
            ></i>
        );
    };

    const exportExcel = () => {
        const exports = invoiceSubscriptions.map((data) => {
            return {
                Kode: data.code ?? "-",
                Lembaga: data.partner ? data.partner.name : "-",
                NPWP: data.partner ? data.partner.npwp : "-",
                Link_Dokumen: {
                    v:
                        window.location.origin +
                            "/" +
                            data.invoice_subscription_doc ?? "-",
                    h: "link",
                    l: {
                        Target:
                            window.location.origin +
                                "/storage/" +
                                data.invoice_subscription_doc ?? "-",
                        Tooltip: "Klik untuk membuka dokumen",
                    },
                },
                Tanggal_Pembuatan: formateDate(data.created_at),
            };
        });

        import("xlsx").then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(exports);
            const workbook = {
                Sheets: { data: worksheet },
                SheetNames: ["data"],
            };
            const excelBuffer = xlsx.write(workbook, {
                bookType: "xlsx",
                type: "array",
            });

            saveAsExcelFile(excelBuffer, "invoice_langganan");
        });
    };

    const saveAsExcelFile = (buffer, fileName) => {
        import("file-saver").then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE =
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
                let EXCEL_EXTENSION = ".xlsx";
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE,
                });

                module.default.saveAs(data, fileName + EXCEL_EXTENSION);
            }
        });
    };

    const handleFilter = async (e) => {
        e.preventDefault();
        setIsLoadingData(true);
        const formData = {
            user: dataFilter.user,
            input_date: dataFilter.input_date,
            status: dataFilter.status,
        };

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content");

        const response = await axios.post(
            "/invoice_subscriptions/filter",
            formData,
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
            }
        );
        const data = response.data;
        setInvoiceSubscriptions(data);
        setSidebarFilter(false);
        setIsLoadingData(false);
    };

    const header = () => {
        return (
            <HeaderDatatable
                globalFilterValue={globalFilterValue}
                onGlobalFilterChange={onGlobalFilterChange}
                setSidebarFilter={setSidebarFilter}
                exportExcel={exportExcel}
                isMobile={isMobile}
            >
                <Button
                    className="shadow-md flex justify-center w-[10px] lg:w-[90px] border border-slate-600 bg-transparent text-slate-600 dark:bg-slate-700 dark:text-slate-300 rounded-lg"
                    onClick={(e) => {
                        zipAll();
                    }}
                    disabled={selectedInvoices.length < 2}
                >
                    <span className="w-full flex justify-center items-center gap-1">
                        <i
                            className="pi pi-box"
                            style={{ fontSize: "0.8rem" }}
                        ></i>{" "}
                        {!isMobile && <span>zip</span>}
                    </span>
                </Button>
                <Button
                    className="shadow-md w-[10px] lg:w-[90px] border border-slate-600 bg-transparent text-slate-600 dark:bg-slate-700 dark:text-slate-300 rounded-lg"
                    onClick={() => setSidebarFilter(true)}
                >
                    <span className="w-full flex justify-center items-center gap-1">
                        <i
                            className="pi pi-filter"
                            style={{ fontSize: "0.7rem" }}
                        ></i>{" "}
                        {!isMobile && <span>filter</span>}
                    </span>
                </Button>
                <Button
                    className="shadow-md w-[10px] lg:w-[90px] bg-transparent text-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:border rounded-lg"
                    onClick={exportExcel}
                    data-pr-tooltip="XLS"
                >
                    <span className="w-full flex items-center justify-center gap-1">
                        <i
                            className="pi pi-file-excel"
                            style={{ fontSize: "0.8rem" }}
                        ></i>{" "}
                        {!isMobile && <span>export</span>}
                    </span>
                </Button>
            </HeaderDatatable>
        );
    };

    const handleEditXenditLink = () => {
        const formData = { xendit_link: dataXendit };
        windowEscapeRef.current.click();
        axios
            .put("invoice_subscriptions/" + data.uuid + "/xendit", formData, {
                headers: {
                    "X-CSRF-TOKEN": document.head.querySelector(
                        'meta[name="csrf-token"]'
                    ).content,
                },
            })
            .then((response) => {
                if (response.data.error) {
                    showError(response.data.error);
                } else {
                    showSuccess("Update");
                    getInvoiceSubscriptions();
                    setDataXendit((prev) => (prev = null));
                    reset();
                }
            });
    };

    const textEditor = (options) => {
        setData(options.rowData);
        return (
            <div className="flex items-center gap-1">
                <InputText
                    type="text"
                    className="w-[10rem]"
                    value={options.value}
                    onChange={(e) => {
                        options.editorCallback(e.target.value);
                        setDataXendit(e.target.value);
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                />
                <div className="flex gap-1">
                    <Button
                        icon="pi pi-times"
                        onClick={() => {
                            windowEscapeRef.current.click();
                        }}
                        className="p-0 rounded-full bg-red-500  dark:text-white"
                    ></Button>
                    <Button
                        icon="pi pi-check"
                        className="p-0 rounded-full bg-green-500  dark:text-white"
                        onClick={handleEditXenditLink}
                    ></Button>
                </div>
            </div>
        );
    };

    const cellEditor = (options) => {
        return textEditor(options);
    };

    const optionSignatureTemplate = (item) => {
        return (
            <div className="flex flex-wrap p-2 align-items-center items-center gap-3">
                <img
                    className="w-[6rem] shadow-2 flex-shrink-0 border-round"
                    src={"/storage/" + item.image}
                    alt={item.name}
                />
                <div className="flex-1 flex flex-col gap-2 xl:mr-8">
                    <span className="font-bold">{item.name}</span>
                    <div className="flex align-items-center gap-2">
                        <span>{item.position}</span>
                    </div>
                </div>
            </div>
        );
    };

    const selectedOptionTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const optionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    const items = [
        {
            label: "Update",
            icon: "pi pi-refresh",
            command: () => {
                toast.current.show({
                    severity: "success",
                    summary: "Updated",
                    detail: "Data Updated",
                });
            },
        },
        {
            label: "Delete",
            icon: "pi pi-times",
            command: () => {
                toast.current.show({
                    severity: "warn",
                    summary: "Delete",
                    detail: "Data Deleted",
                });
            },
        },
        {
            label: "React Website",
            icon: "pi pi-external-link",
            command: () => {
                window.location.href = "https://reactjs.org/";
            },
        },
        {
            label: "Upload",
            icon: "pi pi-upload",
            command: () => {
                //router.push('/fileupload');
            },
        },
    ];

    const headerTransaction = (
        <div className="flex flex-row gap-2 bg-gray-50 dark:bg-transparent p-2 rounded-lg align-items-center items-center justify-between justify-content-between">
            <div className="w-[15%]">
                {permissions.includes("tambah transaksi") && (
                    <Button
                        label="Input Pembayaran"
                        className="bg-purple-600 max-w-[146px] w-full text-xs shadow-md rounded-lg mr-2"
                        icon={addButtonIcon}
                        onClick={() => {
                            setModalTransactionIsVisible(
                                (prev) => (prev = true)
                            );
                            // resetTransaction("nominal");
                        }}
                        aria-controls="popup_menu_right"
                        aria-haspopup
                    />
                )}
            </div>
        </div>
    );

    const allowExpansion = (rowData) => {
        return rowData.bills.length >= 0;
    };

    const onRowExpand = (event) => {
        resetTransaction(
            "nominal",
            "date",
            "money",
            "payment_for",
            "metode",
            "signature"
        );

        setDataTransaction((prev) => ({
            ...prev,
            invoice_subscription: event.data.uuid,
            partner: {
                ...prev.partner,
                name: event.data.partner_name,
                id: event.data.partner.id,
            },
            rest_bill: event.data.rest_of_bill,
        }));
    };

    const actionTransactionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {permissions.includes("edit transaksi") && (
                    <Button
                        icon="pi pi-pencil"
                        rounded
                        outlined
                        className="mr-2"
                        onClick={() => {
                            setModalEditTransactionIsVisible(true);
                            handleEditTransaction(rowData);
                        }}
                    />
                )}
                {permissions.includes("hapus transaksi") && (
                    <Button
                        icon="pi pi-trash"
                        rounded
                        outlined
                        severity="danger"
                        onClick={() => {
                            handleDeleteTransaction(rowData);
                        }}
                    />
                )}
            </React.Fragment>
        );
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div className="md:px-14 pb-2">
                <div className="flex">
                    <DataTable
                        headerClassName="bg-red-500"
                        value={data.transactions}
                        className=""
                        header={headerTransaction}
                        emptyMessage="Transaksi tidak ditemukan."
                    >
                        <Column
                            header="No"
                            body={(_, { rowIndex }) => rowIndex + 1}
                            style={{ width: "1rem" }}
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                        />
                        <Column
                            field="date"
                            header="Tanggal"
                            style={{ minWidth: "10rem" }}
                            body={(rowData) => {
                                return new Date(
                                    rowData.date
                                ).toLocaleDateString("id");
                            }}
                            headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                        ></Column>
                        <Column
                            field="nominal"
                            header="Nominal"
                            style={{ minWidth: "8rem" }}
                            body={(rowData) => {
                                return rowData.nominal.toLocaleString("id-ID");
                            }}
                            headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                        ></Column>
                        <Column
                            field="money"
                            header="Uang Terbilang"
                            style={{ minWidth: "10rem" }}
                            headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                        ></Column>
                        <Column
                            field="metode"
                            header="Metode"
                            style={{ minWidth: "8rem" }}
                            headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                        ></Column>
                        <Column
                            field="created_by"
                            header="Diinput Oleh"
                            style={{ minWidth: "8rem" }}
                            body={(rowData) => {
                                return rowData.user.name;
                            }}
                            headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                        ></Column>
                        <Column
                            body={(rowData) => {
                                return rowData.receipt_doc == "" ? (
                                    <ProgressSpinner
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                        }}
                                        strokeWidth="8"
                                        fill="var(--surface-ground)"
                                        animationDuration=".5s"
                                    />
                                ) : (
                                    <div className="flex w-full h-full items-center justify-center">
                                        <a
                                            href={
                                                "/storage/" +
                                                rowData.receipt_doc
                                            }
                                            download={`Kwitansi_${rowData.partner_name}`}
                                            class="font-bold  w-full h-full text-center rounded-full "
                                        >
                                            <i
                                                className="pi pi-file-pdf"
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    fontSize: "1.5rem",
                                                }}
                                            ></i>
                                        </a>
                                    </div>
                                );
                            }}
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                            align="left"
                            header="Dokumen"
                            style={{ minWidth: "2rem" }}
                        ></Column>
                        <Column
                            header="Action"
                            body={actionTransactionBodyTemplate}
                            style={{ minWidth: "12rem" }}
                            className="dark:border-none"
                            headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                        ></Column>
                    </DataTable>
                </div>
            </div>
        );
    };

    const handleSubmitForm = (e, type) => {
        e.preventDefault();

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content");

        if (type === "tambah") {
            axios
                .post(
                    "/invoice_subscriptions/transaction",
                    {
                        dataTransaction,
                    },
                    {
                        headers: {
                            "X-CSRF-TOKEN": csrfToken,
                        },
                    }
                )
                .then((response) => {
                    if (response.data.error) {
                        showError(response.data.error);
                    } else {
                        showSuccess("Tambah");
                        setModalTransactionIsVisible((prev) => false);

                        getInvoiceSubscriptions();
                        resetTransaction(
                            "nominal",
                            "date",
                            "money",
                            "payment_for",
                            "metode",
                            "signature"
                        );
                        setDataTransaction((prev) => ({
                            ...prev,
                            rest_bill: response.data.rest_of_bill,
                        }));
                    }
                });
        } else {
            axios
                .put(
                    "/invoice_subscriptions/transaction/" +
                        dataTransaction.uuid,
                    {
                        dataTransaction,
                    },
                    {
                        headers: {
                            "X-CSRF-TOKEN": document.head.querySelector(
                                'meta[name="csrf-token"]'
                            ).content,
                        },
                    }
                )
                .then((response) => {
                    if (response.data.error) {
                        showError(response.data.error);
                    } else {
                        showSuccess("Update");
                        setModalEditTransactionIsVisible(
                            (prev) => (prev = false)
                        );

                        getInvoiceSubscriptions();
                        resetTransaction(
                            "nominal",
                            "date",
                            "money",
                            "payment_for",
                            "metode",
                            "signature"
                        );
                        setDataTransaction((prev) => ({
                            ...prev,
                            rest_bill: response.data.rest_of_bill,
                        }));
                    }
                });
        }
    };

    const clear = () => {
        toast.current.clear();
    };

    const showDocumentLoading = () => {
        toast.current.show({
            severity: "info",
            summary: "Sedang membuat dokumen",
            sticky: true,
            closable: false,
            content: (props) => (
                <div className="flex flex-row items-center gap-5">
                    <i
                        className="pi pi-spin pi-spinner"
                        style={{ fontSize: "1rem" }}
                    ></i>

                    <div className="font-base text-900">
                        {props.message.summary}
                    </div>
                </div>
            ),
        });
    };

    const zipAll = async (uuid) => {
        axios
            .post(
                "/invoice_subscriptions/zip",
                {
                    selectedInvoices,
                },
                {
                    headers: {
                        "X-CSRF-TOKEN": document.head.querySelector(
                            'meta[name="csrf-token"]'
                        ).content,
                    },
                }
            )
            .then((response) => {
                const zipBlob = response.data.zip_blob;

                const dataURI = `data:application/zip;base64,${zipBlob}`;

                const downloadLink = document.createElement("a");
                downloadLink.href = dataURI;
                downloadLink.download = "invoice_langganan.zip";
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            });
    };

    const handleSubmitFormMassal = (e, type) => {
        e.preventDefault();

        // showDocumentLoading();
        setModalBundleIsVisible((prev) => false);
        if (type === "tambah") {
            post("/invoice_subscriptions/batch", {
                onSuccess: () => {
                    showSuccess("Tambah");
                    getInvoiceSubscriptions();
                    reset();
                    clear();
                },
                onError: () => {
                    showError("Tambah");
                    clear();
                },
            });
        } else {
            post(`activity/${data.uuid}`, {
                onSuccess: () => {
                    showSuccess("Update");
                    setModalEditActivityIsVisible((prev) => false);
                    getSlas();
                    reset();
                },
                onError: () => {
                    showError("Update");
                },
            });
        }
    };

    if (preRenderLoad) {
        return <SkeletonDatatable auth={auth} />;
    }

    return (
        <DashboardLayout auth={auth.user} className="">
            <Toast ref={toast} />
            <ConfirmDialog />

            <ConfirmPopup />

            {/* Sidebar filter */}
            <Sidebar
                header="Filter"
                visible={sidebarFilter}
                className="w-full md:w-[30%] px-3 dark:glass dark:text-white"
                position="right"
                onHide={() => setSidebarFilter(false)}
            >
                <form onSubmit={handleFilter}>
                    <div className="flex flex-col mt-3">
                        <label htmlFor="name">Berdasarkan penginput</label>
                        <Dropdown
                            optionLabel="name"
                            dataKey="id"
                            value={dataFilter.user}
                            onChange={(e) =>
                                setDataFilter("user", e.target.value)
                            }
                            options={users}
                            placeholder="Pilih User"
                            filter
                            showClear
                            valueTemplate={selectedOptionTemplate}
                            itemTemplate={optionTemplate}
                            className="flex justify-center  dark:text-gray-400   "
                        />
                    </div>

                    <div className="flex flex-col mt-3">
                        <label htmlFor="status">Status </label>
                        <Dropdown
                            dataKey="name"
                            value={dataFilter.status}
                            onChange={(e) => {
                                setDataFilter("status", e.target.value);
                            }}
                            options={status}
                            optionLabel="name"
                            placeholder="Pilih Status"
                            className="w-full md:w-14rem"
                        />
                    </div>

                    <div className="flex flex-col mt-3">
                        <label htmlFor="metode">Metode *</label>
                        <Dropdown
                            value={dataFilter.payment_metode}
                            onChange={(e) =>
                                setDataFilter("payment_metode", e.target.value)
                            }
                            options={[
                                { name: "Tunai" },
                                { name: "Cazhbox" },
                                { name: "Transfer Bank" },
                            ]}
                            optionLabel="name"
                            placeholder="Pilih metode"
                            className="w-full md:w-14rem"
                            editable
                        />
                    </div>

                    <div className="flex flex-col mt-3">
                        <label htmlFor="">Tanggal Input</label>
                        <div className="flex items-center gap-2">
                            <Calendar
                                value={
                                    dataFilter.input_date.start
                                        ? new Date(dataFilter.input_date.start)
                                        : null
                                }
                                style={{ height: "35px" }}
                                onChange={(e) => {
                                    setDataFilter("input_date", {
                                        ...dataFilter.input_date,
                                        start: e.target.value,
                                    });
                                }}
                                placeholder="mulai"
                                showIcon
                                dateFormat="dd/mm/yy"
                            />
                            <span>-</span>
                            <Calendar
                                value={
                                    dataFilter.input_date.end
                                        ? new Date(dataFilter.input_date.end)
                                        : null
                                }
                                style={{ height: "35px" }}
                                onChange={(e) => {
                                    setDataFilter("input_date", {
                                        ...dataFilter.input_date,
                                        end: e.target.value,
                                    });
                                }}
                                placeholder="selesai"
                                showIcon
                                dateFormat="dd/mm/yy"
                            />
                        </div>
                    </div>

                    <div className="flex flex-row mt-5">
                        <Button
                            ref={btnFilterRef}
                            label="Terapkan"
                            className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                        />
                        <Button
                            type="button"
                            label="Reset"
                            onClick={(e) => {
                                resetFilter();
                                setTimeout(() => {
                                    btnFilterRef.current.click();
                                }, 500);
                            }}
                            className="outline-purple-600 outline-1 outline-dotted bg-transparent text-slate-700  text-sm shadow-md rounded-lg mr-2"
                        />
                    </div>
                </form>
            </Sidebar>

            {/* Tombol Aksi */}
            <OverlayPanel
                className=" shadow-md p-1 dark:bg-slate-800 dark:text-gray-300"
                ref={action}
            >
                <div className="flex flex-col flex-wrap w-full">
                    {permissions.includes("edit invoice langganan") && (
                        <Button
                            icon="pi pi-pencil"
                            label="edit"
                            className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                            onClick={() => {
                                router.get(
                                    "/invoice_subscriptions/" +
                                        selectedInvoiceSubscription.uuid
                                );
                            }}
                        />
                    )}
                    {permissions.includes("hapus invoice langganan") && (
                        <Button
                            icon="pi pi-trash"
                            label="hapus"
                            className="bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400"
                            onClick={() => {
                                confirmDeleteInvoice();
                            }}
                        />
                    )}
                </div>
            </OverlayPanel>

            <HeaderModule title="Invoice Langganan">
                {permissions.includes("tambah invoice langganan") && (
                    <>
                        <Button
                            label="Tambah"
                            className="bg-purple-600 text-sm shadow-md rounded-lg mr-2"
                            icon={addButtonIcon}
                            onClick={(e) => add.current.toggle(e)}
                        />
                        <OverlayPanel ref={add} className="shadow-md p-0">
                            <div className="flex flex-col text-left">
                                <span>
                                    <Button
                                        label="Massal"
                                        className="bg-transparent hover:bg-slate-200 w-full text-slate-500 dark:hover:text-slate-900 dark:text-white border-b-2 border-slate-400"
                                        onClick={() => {
                                            setModalBundleIsVisible(
                                                (prev) => (prev = true)
                                            );
                                            reset();
                                        }}
                                        aria-controls="popup_menu_right"
                                        aria-haspopup
                                    />
                                </span>
                                <hr className="my-1" />
                                <span>
                                    <Link href="/invoice_subscriptions/create">
                                        <Button
                                            className="bg-transparent hover:bg-slate-200 w-full text-slate-500 dark:hover:text-slate-900 dark:text-white border-b-2 border-slate-400"
                                        >
                                            Satuan
                                        </Button>
                                    </Link>
                                </span>
                            </div>
                        </OverlayPanel>
                    </>
                )}
            </HeaderModule>

            <TabView
                activeIndex={activeIndexTab}
                onTabChange={(e) => {
                    setActiveIndexTab(e.index);
                }}
                className="mt-2"
            >
                <TabPanel header="Semua Invoice">
                    {activeIndexTab == 0 && (
                        <>
                            <ConfirmDialog />
                            <ConfirmDialog2
                                group="declarative"
                                visible={confirmIsVisible}
                                onHide={() => setConfirmIsVisible(false)}
                                message="Konfirmasi kembali jika anda yakin!"
                                header="Konfirmasi kembali"
                                icon="pi pi-info-circle"
                                accept={handleDeleteInvoiceSubscription}
                            />

                            <div
                                className="flex mx-auto flex-col justify-center mt-5 gap-5"
                                ref={windowEscapeRef}
                            >
                                <div className="card p-fluid w-full h-full flex justify-center rounded-lg">
                                    <DataTable
                                        loading={isLoadingData}
                                        className="w-full h-auto rounded-lg dark:glass border-none text-center shadow-md"
                                        pt={{
                                            bodyRow:
                                                "dark:bg-transparent bg-transparent dark:text-gray-300",
                                            table: "dark:bg-transparent bg-white dark:text-gray-300",
                                            header: "",
                                        }}
                                        paginator
                                        rowsPerPageOptions={[10, 25, 50, 100]}
                                        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                                        currentPageReportTemplate="{first} - {last} dari {totalRecords}"
                                        filters={filters}
                                        rows={10}
                                        emptyMessage="Invoice langganan tidak ditemukan."
                                        paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                                        header={header}
                                        value={invoiceSubscriptions}
                                        dataKey="id"
                                        selection={selectedInvoices}
                                        onSelectionChange={(e) =>
                                            setSelectedInvoices(e.value)
                                        }
                                        expandedRows={expandedRows}
                                        onRowToggle={(e) => {
                                            setExpandedRows(e.data);
                                        }}
                                        globalFilterFields={[
                                            "partner.name",
                                            "date",
                                            "code",
                                            "status.name",
                                            "period",
                                        ]}
                                        scrollable
                                        globalFilterMatchMode="contains"
                                        rowExpansionTemplate={
                                            rowExpansionTemplate
                                        }
                                        selectionMode="checkbox"
                                        onRowExpand={onRowExpand}
                                        editMode="cell"
                                    >
                                        <Column
                                            expander={allowExpansion}
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                            frozen
                                            className="bg-white dark:bg-slate-900"
                                            headerClassName="bg-white dark:bg-slate-900"
                                        />

                                        <Column
                                            selectionMode="multiple"
                                            exportable={false}
                                            frozen
                                            className="bg-white dark:bg-slate-900"
                                            headerClassName="bg-white dark:bg-slate-900"
                                        ></Column>

                                        <Column
                                            header="Aksi"
                                            body={actionBodyTemplate}
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                            frozen
                                            align="center"
                                            className="dark:border-none bg-white"
                                            headerClassName="dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300"
                                        ></Column>

                                        <Column
                                            field="code"
                                            className="dark:border-none bg-white lg:whitespace-nowrap lg:w-max"
                                            headerClassName="dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300"
                                            header="Kode"
                                            align="left"
                                            frozen={!isMobile}
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                        ></Column>

                                        <Column
                                            header="Status"
                                            body={(rowData) => {
                                                return (
                                                    <Badge
                                                        value={
                                                            rowData.status.name
                                                        }
                                                        className="text-white"
                                                        style={{
                                                            backgroundColor:
                                                                "#" +
                                                                rowData.status
                                                                    .color,
                                                        }}
                                                    ></Badge>
                                                );
                                            }}
                                            frozen={!isMobile}
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                            className="dark:border-none bg-white lg:whitespace-nowrap lg:w-max"
                                            headerClassName="dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300"
                                            align="left"
                                        ></Column>
                                        <Column
                                            header="Lembaga"
                                            body={(rowData) => (
                                                <button
                                                    onClick={() =>
                                                        handleSelectedDetailPartner(
                                                            rowData
                                                        )
                                                    }
                                                    className="hover:text-blue-700 text-left"
                                                >
                                                    {rowData.partner.name}
                                                </button>
                                            )}
                                            className="dark:border-none bg-white lg:whitespace-nowrap lg:w-max"
                                            headerClassName="dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300"
                                            align="left"
                                            frozen={!isMobile}
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                        ></Column>
                                        <Column
                                            header="NPWP"
                                            body={(rowData) =>
                                                rowData.partner.npwp !== null
                                                    ? formatNPWP(
                                                          rowData.partner.npwp
                                                      )
                                                    : "-"
                                            }
                                            className="dark:border-none bg-white dark:bg-slate-900"
                                            headerClassName="dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300"
                                            align="left"
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                        ></Column>
                                        <Column
                                            field="xendit_link"
                                            className="dark:border-none"
                                            headerClassName="dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300"
                                            header="Link Xendit"
                                            align="left"
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                            editor={(options) =>
                                                cellEditor(options)
                                            }
                                        ></Column>

                                        <Column
                                            field="period"
                                            className="dark:border-none"
                                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                                            align="left"
                                            header="Periode"
                                            hidden
                                            style={{ minWidth: "10rem" }}
                                        ></Column>

                                        {visibleColumns.map((col) => (
                                            <Column
                                                key={col.field}
                                                field={col.field}
                                                header={col.header}
                                                body={(rowData) => {
                                                    if (
                                                        col.type === "location"
                                                    ) {
                                                        return JSON.parse(
                                                            rowData[col.field]
                                                        ).name;
                                                    } else if (
                                                        col.type === "date"
                                                    ) {
                                                        return rowData[
                                                            col.field
                                                        ]
                                                            ? new Date(
                                                                  rowData[
                                                                      col.field
                                                                  ]
                                                              ).toLocaleDateString(
                                                                  "id"
                                                              )
                                                            : "-";
                                                    } else if (
                                                        col.type === "price"
                                                    ) {
                                                        return rowData[
                                                            col.field
                                                        ]
                                                            ? Number(
                                                                  rowData[
                                                                      col.field
                                                                  ]
                                                              ).toLocaleString(
                                                                  "id"
                                                              )
                                                            : 0;
                                                    }
                                                    return rowData[col.field];
                                                }}
                                                style={{
                                                    width: "max-content",
                                                    whiteSpace: "nowrap",
                                                }}
                                            />
                                        ))}

                                        <Column
                                            field="invoice_age"
                                            className="dark:border-none"
                                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                                            align="left"
                                            header="Umur Invoice"
                                            body={(rowData) => {
                                                return (
                                                    rowData.invoice_age +
                                                    " hari"
                                                );
                                            }}
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                        ></Column>

                                        <Column
                                            field="products"
                                            className="dark:border-none"
                                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                                            align="left"
                                            header="List Tagihan"
                                            body={(rowData) => {
                                                return (
                                                    <Button
                                                        label="List"
                                                        className="p-0 underline bg-transparent text-blue-700 text-left"
                                                        onClick={(e) => {
                                                            op.current.toggle(
                                                                e
                                                            );
                                                            setInvoiceBills(
                                                                (prev) =>
                                                                    (prev =
                                                                        rowData.bills)
                                                            );
                                                        }}
                                                        model={items}
                                                        aria-controls="popup_menu_right"
                                                        aria-haspopup
                                                    />
                                                );
                                            }}
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                        ></Column>

                                        <Column
                                            body={(rowData) => {
                                                return rowData.invoice_subscription_doc ==
                                                    null ? (
                                                    <ProgressSpinner
                                                        style={{
                                                            width: "30px",
                                                            height: "30px",
                                                        }}
                                                        strokeWidth="8"
                                                        fill="var(--surface-ground)"
                                                        animationDuration=".5s"
                                                    />
                                                ) : (
                                                    <div className="flex w-full h-full items-center justify-center">
                                                        <a
                                                            href={
                                                                "/storage/" +
                                                                rowData.invoice_subscription_doc
                                                            }
                                                            download={`Invoice_Umum_${rowData.partner_name}`}
                                                            class="font-bold  w-full h-full text-center rounded-full "
                                                        >
                                                            <i
                                                                className="pi pi-file-pdf"
                                                                style={{
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    fontSize:
                                                                        "1.5rem",
                                                                }}
                                                            ></i>
                                                        </a>
                                                    </div>
                                                );
                                            }}
                                            className="dark:border-none"
                                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                                            align="left"
                                            header="Dokumen"
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                        ></Column>
                                        <Column
                                            header="Action"
                                            body={actionBodyTemplate}
                                            style={{
                                                width: "max-content",
                                                whiteSpace: "nowrap",
                                            }}
                                            className="dark:border-none"
                                            headerClassName="dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"
                                        ></Column>
                                    </DataTable>
                                </div>
                            </div>
                        </>
                    )}
                </TabPanel>

                <TabPanel header="Log">
                    {activeIndexTab == 1 && (
                        <Log
                            auth={auth}
                            users={users}
                            showSuccess={showSuccess}
                            showError={showError}
                        />
                    )}
                </TabPanel>

                <TabPanel header="Arsip">
                    {activeIndexTab == 2 && (
                        <Arsip
                            auth={auth}
                            showSuccess={showSuccess}
                            showError={showError}
                        />
                    )}
                </TabPanel>
            </TabView>

            <OverlayPanel
                className="w-[95%] md:max-w-[50%] dark:bg-slate-900 dark:text-gray-300"
                ref={op}
                showCloseIcon
            >
                <DataTable
                    value={invoiceBills}
                    className="my-4 overflow-x-auto w-full"
                    emptyMessage="Produk tidak ditemukan."
                >
                    <Column
                        header="No"
                        body={(_, { rowIndex }) => rowIndex + 1}
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                        className="dark:border-none"
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    />
                    <Column
                        field="bill"
                        header="Tagihan"
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                    <Column
                        field="nominal"
                        header="Nominal"
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                        body={(rowData) => {
                            return rowData.nominal.toLocaleString("id-ID");
                        }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>

                    <Column
                        field="ppn"
                        header="Pajak (%)"
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                        body={(rowData) => {
                            return rowData.ppn;
                        }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                    <Column
                        field="Pajak"
                        header="Pajak"
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                        body={(rowData) => {
                            return rowData.total_ppn.toLocaleString("id-ID");
                        }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>

                    <Column
                        field="total_bill"
                        header="Jumlah"
                        style={{
                            width: "max-content",
                            whiteSpace: "nowrap",
                        }}
                        body={(rowData) => {
                            return rowData.total_bill.toLocaleString("id-ID");
                        }}
                        headerClassName="dark:border-none bg-gray-50 dark:bg-transparent dark:text-gray-300"
                    ></Column>
                </DataTable>
            </OverlayPanel>

            <Dialog
                header="Invoice Massal"
                headerClassName="dark:glass shadow-md dark:text-white"
                className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                contentClassName=" dark:glass dark:text-white"
                visible={modalBundleIsVisible}
                onHide={() => setModalBundleIsVisible(false)}
            >
                <form onSubmit={(e) => handleSubmitFormMassal(e, "tambah")}>
                    <div className="flex flex-col justify-around gap-4 mt-4">
                        <div className="flex bg-green-600 text-white text-xs p-3 rounded-lg justify-between w-full h-full">
                            <p>Template</p>
                            <p className="font-semibold">
                                <a
                                    href={
                                        "/assets/template/excel/invoice_sample.csv"
                                    }
                                    download="sample.csv"
                                    class="font-bold underline w-full h-full text-center rounded-full "
                                >
                                    sample.csv
                                </a>
                            </p>
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="name">CSV</label>

                            <div className="App">
                                <FilePond
                                    onaddfile={(error, fileItems) => {
                                        setData("partner", {
                                            ...data.partner,
                                            excell: fileItems.file,
                                        });
                                    }}
                                    maxFileSize="2mb"
                                    labelMaxFileSizeExceeded="File terlalu besar"
                                    name="files"
                                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                />
                            </div>
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="signature">Tanda Tangan *</label>
                            <Dropdown
                                value={data.partner.signature}
                                onChange={(e) => {
                                    setData("partner", {
                                        ...data.partner,
                                        signature: {
                                            ...data.partner.signature,
                                            name: e.target.value.name,
                                            image: e.target.value.image,
                                        },
                                    });
                                }}
                                dataKey="name"
                                options={signatures}
                                optionLabel="name"
                                placeholder="Pilih Tanda Tangan"
                                filter
                                valueTemplate={selectedOptionTemplate}
                                itemTemplate={optionSignatureTemplate}
                                panelClassName="max-w-[300px]"
                                className="w-full md:w-14rem"
                            />
                        </div>

                        {/* <div className="flex flex-col">
                            <label htmlFor="estimation_date">Tanggal *</label>
                            <Calendar
                                value={data.date ? new Date(data.date) : null}
                                style={{ height: "35px" }}
                                onChange={(e) => {
                                    setData("date", e.target.value);
                                }}
                                showIcon
                                dateFormat="dd/mm/yy"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="estimation_date">
                                Jatuh Tempo Invoice *
                            </label>
                            <Calendar
                                value={
                                    data.due_date
                                        ? new Date(data.due_date)
                                        : null
                                }
                                style={{ height: "35px" }}
                                onChange={(e) => {
                                    setData("due_date", e.target.value);
                                }}
                                showIcon
                                dateFormat="dd/mm/yy"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="activity">Pilih lembaga *</label>
                            <DataTable
                                value={partners}
                                paginator
                                filters={filtersPartner}
                                rows={5}
                                header={headerPartner}
                                scrollable
                                scrollHeight="flex"
                                paginatorClassName="text-xs"
                                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                                tableStyle={{
                                    width: "100%",
                                }}
                                selectionMode={rowClick ? null : "checkbox"}
                                selection={selectedPartners}
                                onSelectionChange={(e) => {
                                    setSelectedPartners(e.value);
                                    setData("partners", e.value);
                                }}
                                dataKey="id"
                            >
                                <Column
                                    selectionMode="multiple"
                                    headerStyle={{ width: "3rem" }}
                                ></Column>
                                <Column
                                    field="name"
                                    header="Lembaga"
                                    style={{ minWidth: "5rem" }}
                                ></Column>
                            </DataTable>
                        </div>

                        <div className="flex flex-col mt-3">
                            <label htmlFor="signature">Tanda Tangan *</label>
                            <Dropdown
                                value={data.signature}
                                onChange={(e) => {
                                    setData("signature", {
                                        ...data.signature,
                                        name: e.target.value.name,
                                        image: e.target.value.image,
                                    });
                                }}
                                dataKey="name"
                                options={signatures}
                                optionLabel="name"
                                placeholder="Pilih Tanda Tangan"
                                filter
                                valueTemplate={selectedOptionTemplate}
                                itemTemplate={optionSignatureTemplate}
                                panelClassName="max-w-[300px]"
                                className="w-full md:w-14rem"
                            />
                        </div> */}
                    </div>

                    <div className="flex justify-center mt-5">
                        <Button
                            label="Submit"
                            disabled={processing}
                            className="bg-purple-600 text-sm shadow-md rounded-lg"
                        />
                    </div>
                </form>
            </Dialog>

            {/* Modal tambah transaksi */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Input Pembayaran"
                    headerClassName="dark:glass shadow-md dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                    contentClassName=" dark:glass dark:text-white"
                    visible={modalTransactionIsVisible}
                    onHide={() => setModalTransactionIsVisible(false)}
                >
                    <form onSubmit={(e) => handleSubmitForm(e, "tambah")}>
                        <div className="flex flex-col mt-3">
                            <div className="flex bg-purple-600 text-white text-xs p-3 rounded-lg justify-between w-full h-full">
                                <p>Sisa tagihan</p>
                                <p className="font-semibold">
                                    Rp{" "}
                                    {dataTransaction.rest_bill
                                        ? dataTransaction.rest_bill.toLocaleString(
                                              "id-ID"
                                          )
                                        : 0}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="date">Tanggal *</label>
                            <Calendar
                                value={
                                    dataTransaction.date
                                        ? new Date(dataTransaction.date)
                                        : null
                                }
                                style={{ height: "35px" }}
                                onChange={(e) => {
                                    setDataTransaction("date", e.target.value);
                                }}
                                showIcon
                                dateFormat="dd-mm-yy"
                                className={`w-full md:w-14rem ${
                                    errors.date && "p-invalid"
                                }`}
                            />
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="money">Diterima Dari *</label>

                            <Dropdown
                                value={dataTransaction.partner}
                                dataKey="id"
                                onChange={(e) => {
                                    setDataTransaction("partner", {
                                        ...dataTransaction.partner,
                                        id: e.target.value.id,
                                        name: e.target.value.name,
                                    });
                                }}
                                options={partners}
                                optionLabel="name"
                                placeholder="Pilih Lembaga"
                                filter
                                disabled
                                valueTemplate={selectedOptionTemplate}
                                itemTemplate={optionTemplate}
                                className="w-full md:w-14rem"
                            />
                        </div>
                        <div className="flex flex-col justify-around mt-3">
                            <label htmlFor="nominal">Nominal *</label>
                            <InputNumber
                                value={dataTransaction.nominal}
                                onValueChange={(e) => {
                                    convertRupiah(e.value);
                                }}
                                defaultValue={0}
                                className="dark:bg-gray-300"
                                id="nominal"
                                aria-describedby="nominal-help"
                                locale="id-ID"
                            />
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="money">Uang Terbilang *</label>
                            <InputText
                                value={dataTransaction.money}
                                onChange={(e) =>
                                    setDataTransaction("money", e.target.value)
                                }
                                className="dark:bg-gray-300"
                                id="money"
                                aria-describedby="money-help"
                            />
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="payment_for">
                                Pembayaran Untuk *
                            </label>
                            <InputText
                                value={dataTransaction.payment_for}
                                onChange={(e) =>
                                    setDataTransaction(
                                        "payment_for",
                                        e.target.value
                                    )
                                }
                                className="dark:bg-gray-300"
                                id="payment_for"
                                aria-describedby="payment_for-help"
                            />
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="metode">Metode *</label>
                            <Dropdown
                                value={dataTransaction.metode}
                                onChange={(e) =>
                                    setDataTransaction("metode", e.target.value)
                                }
                                options={[
                                    { name: "Tunai" },
                                    { name: "Cazhbox" },
                                    { name: "Transfer Bank" },
                                ]}
                                optionLabel="name"
                                placeholder="Pilih Metode"
                                className="w-full md:w-14rem"
                                editable
                            />
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="signature">Tanta tangan *</label>
                            <Dropdown
                                value={dataTransaction.signature}
                                onChange={(e) => {
                                    setDataTransaction("signature", {
                                        ...dataTransaction.signature,
                                        name: e.target.value.name,
                                        position: e.target.value.position,
                                        image: e.target.value.image,
                                    });
                                }}
                                dataKey="name"
                                options={signatures}
                                optionLabel="name"
                                placeholder="Pilih Tanda Tangan"
                                filter
                                valueTemplate={selectedOptionTemplate}
                                itemTemplate={optionSignatureTemplate}
                                className="w-full md:w-14rem"
                            />
                        </div>
                        <div className="flex justify-center my-5">
                            <Button
                                label="Submit"
                                className="bg-purple-600 text-sm shadow-md rounded-lg"
                            />
                        </div>
                    </form>
                </Dialog>
            </div>

            {/* Modal edit transaksi */}
            <div className="card flex justify-content-center">
                <Dialog
                    header="Input Pembayaran"
                    headerClassName="dark:glass shadow-md dark:text-white"
                    className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                    contentClassName=" dark:glass dark:text-white"
                    visible={modalEditTransactionIsVisible}
                    onHide={() => setModalEditTransactionIsVisible(false)}
                >
                    <form onSubmit={(e) => handleSubmitForm(e, "update")}>
                        <div className="flex flex-col mt-3">
                            <div className="flex bg-purple-600 text-white text-xs p-3 rounded-lg justify-between w-full h-full">
                                <p>Sisa tagihan</p>
                                <p className="font-semibold">
                                    Rp{" "}
                                    {dataTransaction.rest_bill
                                        ? dataTransaction.rest_bill.toLocaleString(
                                              "id-ID"
                                          )
                                        : 0}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="date">Tanggal *</label>
                            <Calendar
                                value={
                                    dataTransaction.date
                                        ? new Date(dataTransaction.date)
                                        : null
                                }
                                style={{ height: "35px" }}
                                onChange={(e) => {
                                    setDataTransaction("date", e.target.value);
                                }}
                                showIcon
                                dateFormat="dd-mm-yy"
                                className={`w-full md:w-14rem ${
                                    errors.date && "p-invalid"
                                }`}
                            />
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="money">Diterima Dari *</label>

                            <Dropdown
                                value={dataTransaction.partner}
                                dataKey="id"
                                onChange={(e) => {
                                    setDataTransaction("partner", {
                                        ...dataTransaction.partner,
                                        id: e.target.value.id,
                                        name: e.target.value.name,
                                    });
                                }}
                                options={partners}
                                optionLabel="name"
                                placeholder="Pilih Lembaga"
                                filter
                                valueTemplate={selectedOptionTemplate}
                                itemTemplate={optionTemplate}
                                className="w-full md:w-14rem"
                            />
                        </div>
                        <div className="flex flex-col justify-around mt-3">
                            <label htmlFor="nominal">Nominal *</label>
                            <InputNumber
                                value={dataTransaction.nominal}
                                onValueChange={(e) => {
                                    convertRupiah(e.value);
                                }}
                                defaultValue={0}
                                className="dark:bg-gray-300"
                                id="nominal"
                                aria-describedby="nominal-help"
                                locale="id-ID"
                            />
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="money">Uang Terbilang *</label>
                            <InputText
                                value={dataTransaction.money}
                                onChange={(e) =>
                                    setDataTransaction("money", e.target.value)
                                }
                                className="dark:bg-gray-300"
                                id="money"
                                aria-describedby="money-help"
                            />
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="payment_for">
                                Pembayaran Untuk *
                            </label>
                            <InputText
                                value={dataTransaction.payment_for}
                                onChange={(e) =>
                                    setDataTransaction(
                                        "payment_for",
                                        e.target.value
                                    )
                                }
                                className="dark:bg-gray-300"
                                id="payment_for"
                                aria-describedby="payment_for-help"
                            />
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="metode">Metode *</label>
                            <Dropdown
                                value={dataTransaction.metode}
                                onChange={(e) =>
                                    setDataTransaction("metode", e.target.value)
                                }
                                options={[
                                    { name: "Tunai" },
                                    { name: "Cazhbox" },
                                    { name: "Transfer Bank" },
                                ]}
                                optionLabel="name"
                                placeholder="Pilih Metode"
                                className="w-full md:w-14rem"
                                editable
                            />
                        </div>
                        <div className="flex flex-col mt-3">
                            <label htmlFor="signature">Tanta tangan *</label>
                            <Dropdown
                                value={dataTransaction.signature}
                                onChange={(e) => {
                                    setDataTransaction("signature", {
                                        ...dataTransaction.signature,
                                        name: e.target.value.name,
                                        position: e.target.value.position,
                                        image: e.target.value.image,
                                    });
                                }}
                                dataKey="name"
                                options={signatures}
                                optionLabel="name"
                                placeholder="Pilih Tanda Tangan"
                                filter
                                valueTemplate={selectedOptionTemplate}
                                itemTemplate={optionSignatureTemplate}
                                className="w-full md:w-14rem"
                            />
                        </div>
                        <div className="flex justify-center my-5">
                            <Button
                                label="Submit"
                                className="bg-purple-600 text-sm shadow-md rounded-lg"
                            />
                        </div>
                    </form>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}
