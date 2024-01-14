import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "jspdf-autotable";
import { Dialog } from "primereact/dialog";
import { Head, useForm } from "@inertiajs/react";
import { Calendar } from "primereact/calendar";
import { FilterMatchMode } from "primereact/api";
import { Dropdown } from "primereact/dropdown";
import React from "react";
import { useRef } from "react";
import { Toast } from "primereact/toast";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const Edit = ({ usersDefault, partnersDefault, stpd }) => {
    const [users, setUsers] = useState(usersDefault);
    const [partners, setPartners] = useState(partnersDefault);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [rowClick, setRowClick] = useState(true);
    const cetakBtn = React.useRef();
    const linkDocSTPD = React.useRef();
    const toast = useRef(null);
    const signatures = [
        {
            name: "Muh Arif Mahfudin",
            position: "CEO",
            signature: "/assets/img/signatures/ttd.png",
        },
    ];
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters["global"].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    document.querySelector("body").classList.add("overflow-hidden");

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
        uuid: stpd.uuid,
        code: stpd.code,
        employees: stpd.employees,
        institution: stpd.institution,
        location: stpd.location,
        departure_date: new Date(stpd.departure_date),
        return_date: new Date(stpd.return_date),
        transportation: stpd.transportation,
        accommodation: stpd.accommodation,
        signature: JSON.parse(stpd.signature),
        stpd_doc: stpd.stpd_doc,
    });

    const dialogFooterTemplate = () => {
        return (
            <Button
                label="OK"
                icon="pi pi-check"
                onClick={() => setDialogVisible(false)}
            />
        );
    };

    const ubahFormatTanggal = (tanggal) => {
        if (!tanggal) {
            return "N/A";
        }
        let tanggalAngka = tanggal.getDate();
        let bulanAngka = tanggal.getMonth() + 1;
        let tahunAngka = tanggal.getFullYear();

        let bulanFormat = bulanAngka < 10 ? "0" + bulanAngka : bulanAngka;
        let tahunFormat = tahunAngka;

        let formatTanggal =
            tanggalAngka + "/" + bulanFormat + "/" + tahunFormat;

        return formatTanggal;
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

    const optionSignatureTemplate = (item) => {
        return (
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <img
                    className="w-3rem shadow-2 flex-shrink-0 border-round"
                    src={item.signature}
                    alt={item.name}
                />
                <div className="flex-1 flex flex-col gap-2 xl:mr-8">
                    <span className="font-bold">{item.name}</span>
                    <div className="flex align-items-center gap-2">
                        <span>{item.position}</span>
                    </div>
                </div>
                {/* <span className="font-bold text-900">${item.price}</span> */}
            </div>
        );
    };

    const header = (
        <div className="flex flex-row justify-left gap-2 align-items-center items-end">
            <div className="w-[30%]">
                <span className="p-input-icon-left">
                    <i className="pi pi-search dark:text-white" />
                    <InputText
                        className="dark:bg-transparent dark:placeholder-white"
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Keyword Search"
                    />
                </span>
            </div>
        </div>
    );

    // fungsi toast
    const showSuccess = (type) => {
        toast.current.show({
            severity: "success",
            summary: "Success",
            detail: `${type} data berhasil`,
            life: 3000,
        });
    };

    const showError = (type) => {
        toast.current.show({
            severity: "error",
            summary: "Error",
            detail: `${type} data gagal`,
            life: 3000,
        });
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();

        put("/stpd/" + data.uuid, {
            onSuccess: () => {
                showSuccess("Update");
                window.location = BASE_URL + "/stpd";
                // reset("name", "category", "price", "unit", "description");
            },

            onError: () => {
                showError("Update");
            },
        });
    };

    return (
        <>
            <Head title="Surat Keterangan Perjalanan Dinas"></Head>
            <Toast ref={toast} />
            <div className="h-screen max-h-screen overflow-y-hidden">
                <div className="flex flex-col h-screen max-h-screen overflow-hidden md:flex-row z-40 relative gap-5">
                    <div className="md:w-[40%] overflow-y-auto h-screen max-h-screen p-5">
                        <Card title="Surat Keterangan Perjalanan Dinas">
                            <div className="flex flex-col">
                                <Button
                                    label="Tambah karyawan"
                                    icon="pi pi-external-link"
                                    onClick={() => setDialogVisible(true)}
                                />

                                <div className="flex flex-col mt-3">
                                    <InputText
                                        value={data.code}
                                        onChange={(e) =>
                                            setData("code", e.target.value)
                                        }
                                        className="dark:bg-gray-300"
                                        id="code"
                                        aria-describedby="code-help"
                                        hidden
                                    />
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="lembaga">Lembaga *</label>
                                    <Dropdown
                                        value={data.institution}
                                        onChange={(e) => {
                                            setData({
                                                ...data,
                                                institution: e.target.value,
                                                location:
                                                    e.target.value.address,
                                            });
                                        }}
                                        options={partners}
                                        optionLabel="name"
                                        placeholder="Pilih Lembaga"
                                        filter
                                        valueTemplate={selectedOptionTemplate}
                                        itemTemplate={optionTemplate}
                                        className="w-full md:w-14rem"
                                        editable
                                    />
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="location">Lokasi *</label>
                                    <InputText
                                        value={data.location}
                                        onChange={(e) =>
                                            setData("location", e.target.value)
                                        }
                                        className="dark:bg-gray-300"
                                        id="location"
                                        aria-describedby="location-help"
                                    />
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="register_date">
                                        Tanggal Berangkat *
                                    </label>
                                    <Calendar
                                        value={
                                            data.departure_date
                                                ? new Date(data.departure_date)
                                                : null
                                        }
                                        style={{ height: "35px" }}
                                        onChange={(e) => {
                                            const formattedDate = new Date(
                                                e.target.value
                                            )
                                                .toISOString()
                                                .split("T")[0];
                                            console.log(formattedDate);
                                            console.log(e.target.value);
                                            setData(
                                                "departure_date",
                                                e.target.value
                                            );
                                        }}
                                        showIcon
                                        dateFormat="yy-mm-dd"
                                    />
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="register_date">
                                        Tanggal Kembali *
                                    </label>
                                    <Calendar
                                        value={
                                            data.return_date
                                                ? new Date(data.return_date)
                                                : null
                                        }
                                        style={{ height: "35px" }}
                                        onChange={(e) => {
                                            const formattedDate = new Date(
                                                e.target.value
                                            )
                                                .toISOString()
                                                .split("T")[0];
                                            setData(
                                                "return_date",
                                                e.target.value
                                            );
                                        }}
                                        showIcon
                                        dateFormat="yy-mm-dd"
                                    />
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="transportation">
                                        Kendaraan *
                                    </label>
                                    <InputText
                                        value={data.transportation}
                                        onChange={(e) =>
                                            setData(
                                                "transportation",
                                                e.target.value
                                            )
                                        }
                                        className="dark:bg-gray-300"
                                        id="transportation"
                                        aria-describedby="transportation-help"
                                    />
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="accomodation">
                                        Akomodasi *
                                    </label>
                                    <InputText
                                        value={data.accommodation}
                                        onChange={(e) =>
                                            setData(
                                                "accommodation",
                                                e.target.value
                                            )
                                        }
                                        className="dark:bg-gray-300"
                                        id="accommodation"
                                        aria-describedby="accommodation-help"
                                    />
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="signature">
                                        Tanda Tangan *
                                    </label>

                                    <Dropdown
                                        value={data.signature.name}
                                        onChange={(e) => {
                                            setData({
                                                ...data,
                                                signature: e.target.value,
                                            });
                                        }}
                                        options={signatures}
                                        optionLabel="name"
                                        optionValue="name"
                                        placeholder="Pilih Tanda Tangan"
                                        filter
                                        valueTemplate={selectedOptionTemplate}
                                        itemTemplate={optionSignatureTemplate}
                                        className="w-full md:w-14rem"
                                    />
                                </div>

                                <div className="flex-flex-col mt-3">
                                    <form onSubmit={handleSubmitForm}>
                                        <Button className="mx-auto justify-center block">
                                            Submit
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <Dialog
                        header="Karyawan"
                        visible={dialogVisible}
                        style={{ width: "75vw" }}
                        maximizable
                        modal
                        contentStyle={{ height: "550px" }}
                        onHide={() => setDialogVisible(false)}
                        footer={dialogFooterTemplate}
                    >
                        <DataTable
                            value={users}
                            paginator
                            filters={filters}
                            rows={5}
                            header={header}
                            scrollable
                            scrollHeight="flex"
                            tableStyle={{ minWidth: "50rem" }}
                            selectionMode={rowClick ? null : "checkbox"}
                            selection={data.employees}
                            onSelectionChange={(e) =>
                                setData("employees", e.value)
                            }
                            dataKey="user_id"
                        >
                            <Column
                                selectionMode="multiple"
                                headerStyle={{ width: "3rem" }}
                            ></Column>
                            <Column field="name" header="Name"></Column>
                            <Column
                                filter
                                header="Jabatan"
                                body={(rowData) => rowData.position}
                            ></Column>
                        </DataTable>
                    </Dialog>

                    <div className="md:w-[60%] h-screen max-h-screen overflow-y-auto p-5">
                        <header>
                            <div className="flex justify-between items-center">
                                <div className="w-full">
                                    <h2 className="font-bold text-sm">
                                        PT CAZH TEKNOLOGI INOVASI
                                    </h2>
                                    <p className="text-xs ">
                                        Bonavida Park D1, Jl. Raya Karanggintung
                                    </p>
                                    <p className="text-xs">
                                        Kec. Sumbang, Kab. Banyumas,
                                    </p>
                                    <p className="text-xs">Jawa Tengah 53183</p>
                                    <p className="text-xs">hello@cazh.id</p>
                                </div>
                                <div className="w-full">
                                    <img
                                        src="/assets/img/cazh.png"
                                        alt=""
                                        className="scale-[0.6]"
                                        // style={{ scale: 0.8 }}
                                    />
                                    {/* <button className="z-50" onClick={tes}>
                                    tes
                                </button> */}
                                </div>
                            </div>
                        </header>

                        <div className="text-center mt-5">
                            <h1 className="font-bold underline mx-auto">
                                SURAT TUGAS PERJALANAN DINAS
                            </h1>
                            <p className="">Nomor : 001/CAZHSPJ/X/2023</p>
                        </div>

                        <div className="w-full mt-5">
                            <table className="w-full">
                                <thead className="bg-blue-100 text-left">
                                    <th>No</th>
                                    <th>Nama Karyawan</th>
                                    <th>Jabatan</th>
                                </thead>
                                <tbody>
                                    {data.employees?.length == 0 && (
                                        <tr className="text-center">
                                            <td colSpan={3}>
                                                Karyawan belum ditambah
                                            </td>
                                        </tr>
                                    )}
                                    {data.employees?.map((data, i) => {
                                        return (
                                            <tr key={data.name + i}>
                                                <td>{++i}</td>
                                                <td>{data.name}</td>
                                                <td>{data.position}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <p className="mt-10">
                            Untuk melaksanakan tugas melakukan perjalanan dinas
                            dengan ketentuan sebagai berikut:
                        </p>

                        <div className="w-full mt-5">
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td className="text-gray-700 text-base font-bold w-1/6">
                                            Lembaga Tujuan
                                        </td>
                                        <td className="text-gray-700 text-base w-[2%]">
                                            :
                                        </td>
                                        <td className="text-gray-700 text-base w-7/12">
                                            {typeof data.institution ===
                                            "object"
                                                ? data.institution.name
                                                : data.institution}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-gray-700 text-base font-bold w-1/6">
                                            Lokasi
                                        </td>
                                        <td className="text-gray-700 text-base w-[2%]">
                                            :
                                        </td>
                                        <td className="text-gray-700 text-base w-7/12">
                                            {data.location}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-gray-700 text-base font-bold w-1/6">
                                            Berangkat
                                        </td>
                                        <td className="text-gray-700 text-base w-[2%]">
                                            :
                                        </td>
                                        <td className="text-gray-700 text-base w-7/12">
                                            {ubahFormatTanggal(
                                                data.departure_date
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-gray-700 text-base font-bold w-1/6">
                                            Kembali
                                        </td>
                                        <td className="text-gray-700 text-base w-[2%]">
                                            :
                                        </td>
                                        <td className="text-gray-700 text-base w-7/12">
                                            {ubahFormatTanggal(
                                                data.return_date
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-gray-700 text-base font-bold w-1/6">
                                            Kendaraan
                                        </td>
                                        <td className="text-gray-700 text-base w-[2%]">
                                            :
                                        </td>
                                        <td className="text-gray-700 text-base w-7/12">
                                            {data.transportation}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-gray-700 text-base font-bold w-1/6">
                                            Akomodasi
                                        </td>
                                        <td className="text-gray-700 text-base w-[2%]">
                                            :
                                        </td>
                                        <td className="text-gray-700 text-base w-7/12">
                                            {data.accommodation}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="w-full mt-5 text-justify">
                            Semua biaya dalam perjalanan dinas, konsumsi, serta
                            akomodasi dalam rangka perjalanan dinas ini akan
                            menjadi tanggung jawab PT Cazh Teknologi Inovasi
                            sesuai peraturan perjalanan dinas yang berlaku.
                        </div>

                        <div className="w-full mt-5 text-justify">
                            Demikian surat ini dibuat agar dapat dilaksanakan
                            dengan baik dan penuh tanggung jawab. Kepada semua
                            pihak yang terlibat dimohon kerja sama yang baik
                            agar perjalanan dinas ini dapat terlaksana dengan
                            lancar.
                        </div>

                        <div className="flex flex-col mt-5 justify-start w-[30%]">
                            <p>Purwokerto, {new Date().getFullYear()}</p>
                            <img
                                src={BASE_URL + data.signature.signature}
                                alt=""
                            />
                            <p>{data.signature.name}</p>
                            <p>{data.signature.position}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white h-screen z-10 w-full absolute top-0 left-0"></div>
            </div>
        </>
    );
};

export default Edit;
