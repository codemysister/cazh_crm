import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { useState } from "react";
import { Button } from "primereact/button";
import { Head, Link, useForm } from "@inertiajs/react";
import { useRef } from "react";
import { FilterMatchMode } from "primereact/api";
import { Dropdown } from "primereact/dropdown";
import React from "react";
import { Toast } from "primereact/toast";
import { useEffect } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import InputError from "@/Components/InputError";
import DialogInstitution from "@/Components/DialogInstitution";
import LoadingDocument from "@/Components/LoadingDocument";
import { BlockUI } from "primereact/blockui";

const Edit = ({ partnersProp, signaturesProp, memo }) => {
    const [partners, setPartners] = useState(partnersProp);
    const [signatures, setSignatures] = useState(signaturesProp);
    const toast = useRef(null);
    const [leads, setLeads] = useState(null);
    const [dialogInstitutionVisible, setDialogInstitutionVisible] =
        useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [provinceName, setProvinceName] = useState(null);
    const [blocked, setBlocked] = useState(false);

    const [theme, setTheme] = useState(localStorage.theme);
    useEffect(() => {
        theme
            ? (localStorage.theme = "dark")
            : localStorage.removeItem("theme");

        if (
            localStorage.theme === "dark" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    const animatePartnerNameRef = useRef(null);
    const animatePriceCardRef = useRef(null);
    const animatePriceECardRef = useRef(null);
    const animatePriceSubscriptionRef = useRef(null);
    const animateConsiderationRef = useRef(null);
    const animateSignatureFirstRef = useRef(null);
    const animateSignatureSecondRef = useRef(null);
    const animateSignatureThirdRef = useRef(null);

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const triggerInputFocus = (ref) => {
        if (ref.current) {
            ref.current.classList.add("twinkle");
            ref.current.focus();
        }
        return null;
    };

    const stopAnimateInputFocus = (ref) => {
        ref.current.classList.remove("twinkle");

        return null;
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
        uuid: memo.uuid,
        code: memo.code,
        partner: {
            id: memo.partner_id,
            uuid: memo.memoable.uuid,
            name: memo.partner_name,
        },
        price_card: memo.price_card,
        price_e_card: memo.price_e_card,
        price_subscription: memo.price_subscription,
        consideration: memo.consideration,
        signature_applicant: {
            name: memo.signature_applicant_name,
            image: memo.signature_applicant_image,
        },
        signature_acknowledges: {
            name: memo.signature_acknowledges_name,
            image: memo.signature_acknowledges_image,
        },
        signature_agrees: {
            name: memo.signature_agrees_name,
            image: memo.signature_agrees_image,
        },
    });

    useEffect(() => {
        if (processing) {
            setBlocked(true);
        } else {
            setBlocked(false);
        }
    }, [processing]);

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

    const optionSignatureTemplate = (item) => {
        return (
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <img
                    className="w-3rem shadow-2 flex-shrink-0 border-round"
                    src={"/storage/" + item.image}
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

    const optionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
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

        put("/memo/" + data.uuid, {
            onSuccess: () => {
                showSuccess("Tambah");
                window.location = "/memo";
                // reset("name", "category", "price", "unit", "description");
            },

            onError: () => {
                showError("Tambah");
            },
        });
    };

    return (
        <>
            <Head title="Memo Deviasi Harga"></Head>
            <Toast ref={toast} />

            <BlockUI blocked={blocked} template={LoadingDocument}>
                <div className="h-screen max-h-screen overflow-y-hidden">
                    <div className="flex flex-col h-screen max-h-screen overflow-hidden md:flex-row z-40 relative gap-5">
                        <div className="md:w-[35%] overflow-y-auto h-screen max-h-screen p-5">
                            <Card>
                                <div className="flex justify-between items-center mb-4">
                                    <h1 className="font-bold text-xl">
                                        Memo Deviasi Harga
                                    </h1>
                                    <Link href="/memo">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            class="w-6 h-6"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                                            />
                                        </svg>
                                    </Link>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex flex-col">
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
                                        <label htmlFor="lembaga">
                                            Lembaga *
                                        </label>
                                        <InputText
                                            value={data.partner.name}
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animatePartnerNameRef
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animatePartnerNameRef
                                                );
                                            }}
                                            onClick={() => {
                                                setDialogInstitutionVisible(
                                                    true
                                                );
                                            }}
                                            placeholder="Pilih lembaga"
                                            className="dark:bg-gray-300 cursor-pointer"
                                            id="partner"
                                            aria-describedby="partner-help"
                                        />
                                        <InputError
                                            message={errors["partner.name"]}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="price_card">
                                            Harga Kartu *
                                        </label>
                                        <InputText
                                            value={data.price_card}
                                            onChange={(e) =>
                                                setData(
                                                    "price_card",
                                                    e.target.value
                                                )
                                            }
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animatePriceCardRef
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animatePriceCardRef
                                                );
                                            }}
                                            className="dark:bg-gray-300"
                                            id="price_card"
                                            aria-describedby="price_card-help"
                                        />
                                        <InputError
                                            message={errors["price_card"]}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="price_e_card">
                                            Harga E-Card *
                                        </label>
                                        <InputText
                                            value={data.price_e_card}
                                            onChange={(e) =>
                                                setData(
                                                    "price_e_card",
                                                    e.target.value
                                                )
                                            }
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animatePriceECardRef
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animatePriceECardRef
                                                );
                                            }}
                                            className="dark:bg-gray-300"
                                            id="price_e_card"
                                            aria-describedby="price_e_card-help"
                                        />
                                        <InputError
                                            message={errors["price_e_card"]}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="price_subscription">
                                            Biaya Langganan *
                                        </label>
                                        <InputText
                                            value={data.price_subscription}
                                            onChange={(e) =>
                                                setData(
                                                    "price_subscription",
                                                    e.target.value
                                                )
                                            }
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animatePriceSubscriptionRef
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animatePriceSubscriptionRef
                                                );
                                            }}
                                            className="dark:bg-gray-300"
                                            id="price_subscription"
                                            aria-describedby="price_subscription-help"
                                        />
                                        <InputError
                                            message={
                                                errors["price_subscription"]
                                            }
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="consideration">
                                            Pertimbangan *
                                        </label>
                                        <InputTextarea
                                            value={data.consideration}
                                            onChange={(e) =>
                                                setData(
                                                    "consideration",
                                                    e.target.value
                                                )
                                            }
                                            onFocus={() => {
                                                triggerInputFocus(
                                                    animateConsiderationRef
                                                );
                                            }}
                                            onBlur={() => {
                                                stopAnimateInputFocus(
                                                    animateConsiderationRef
                                                );
                                            }}
                                            rows={5}
                                            cols={30}
                                        />
                                        <InputError
                                            message={errors["consideration"]}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="signature">
                                            Tanda Tangan Pihak Mengajukan*
                                        </label>
                                        <Dropdown
                                            dataKey="name"
                                            value={data.signature_applicant}
                                            onChange={(e) => {
                                                setData({
                                                    ...data,
                                                    signature_applicant: {
                                                        name: e.target.value
                                                            .name,
                                                        image: e.target.value
                                                            .image,
                                                    },
                                                });
                                            }}
                                            onShow={() => {
                                                triggerInputFocus(
                                                    animateSignatureFirstRef
                                                );
                                            }}
                                            onHide={() => {
                                                stopAnimateInputFocus(
                                                    animateSignatureFirstRef
                                                );
                                            }}
                                            options={signatures}
                                            optionLabel="name"
                                            placeholder="Pilih Tanda Tangan"
                                            filter
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={
                                                optionSignatureTemplate
                                            }
                                            className="w-full md:w-14rem"
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    "signature_applicant.image"
                                                ]
                                            }
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="signature">
                                            Tanda Tangan Pihak Mengetahui*
                                        </label>
                                        <Dropdown
                                            dataKey="name"
                                            value={data.signature_acknowledges}
                                            onChange={(e) => {
                                                setData({
                                                    ...data,
                                                    signature_acknowledges: {
                                                        name: e.target.value
                                                            .name,
                                                        image: e.target.value
                                                            .image,
                                                    },
                                                });
                                            }}
                                            options={signatures}
                                            optionLabel="name"
                                            placeholder="Pilih Tanda Tangan"
                                            filter
                                            onShow={() => {
                                                triggerInputFocus(
                                                    animateSignatureSecondRef
                                                );
                                            }}
                                            onHide={() => {
                                                stopAnimateInputFocus(
                                                    animateSignatureSecondRef
                                                );
                                            }}
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={
                                                optionSignatureTemplate
                                            }
                                            className="w-full md:w-14rem"
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    "signature_acknowledges.image"
                                                ]
                                            }
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="flex flex-col mt-3">
                                        <label htmlFor="signature">
                                            Tanda Tangan Pihak Menyetujui*
                                        </label>
                                        <Dropdown
                                            dataKey="name"
                                            value={data.signature_agrees}
                                            onChange={(e) => {
                                                setData({
                                                    ...data,
                                                    signature_agrees: {
                                                        name: e.target.value
                                                            .name,
                                                        image: e.target.value
                                                            .image,
                                                    },
                                                });
                                            }}
                                            options={signatures}
                                            optionLabel="name"
                                            placeholder="Pilih Tanda Tangan"
                                            filter
                                            onShow={() => {
                                                triggerInputFocus(
                                                    animateSignatureThirdRef
                                                );
                                            }}
                                            onHide={() => {
                                                stopAnimateInputFocus(
                                                    animateSignatureThirdRef
                                                );
                                            }}
                                            valueTemplate={
                                                selectedOptionTemplate
                                            }
                                            itemTemplate={
                                                optionSignatureTemplate
                                            }
                                            className="w-full md:w-14rem"
                                        />
                                        <InputError
                                            message={
                                                errors["signature_agrees.image"]
                                            }
                                            className="mt-2"
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

                        <div className="md:w-[65%] hidden md:block h-screen text-sm max-h-screen overflow-y-auto p-5">
                            <header>
                                <div className="flex justify-between items-center">
                                    <div className="w-full">
                                        <img
                                            src="/assets/img/cazh.png"
                                            alt=""
                                            className="float-left w-1/3 h-1/3"
                                        />
                                    </div>
                                    <div className="w-full text-right text-xs">
                                        <h2 className="font-bold">
                                            PT CAZH TEKNOLOGI INOVASI
                                        </h2>
                                        <p>
                                            Bonavida Park D1, Jl. Raya
                                            Karanggintung
                                        </p>
                                        <p>
                                            Kec. Sumbang, Kab. Banyumas,Jawa
                                            Tengah 53183
                                        </p>

                                        <p>
                                            hello@cards.co.id |
                                            https://cards.co.id
                                        </p>
                                    </div>
                                </div>
                            </header>

                            <div className="text-center mt-5">
                                <h1 className="font-bold uppercase text-lg mx-auto">
                                    Memo Internal
                                </h1>
                                <h1 className="font-bold uppercase text-lg mx-auto">
                                    Pengajuan Deviasi Harga
                                </h1>
                                <p className="">Nomor : {data.code}</p>
                            </div>

                            <hr className="h-[2px] my-2 bg-slate-400" />

                            <p className="mt-5 text-justify">
                                Bersama memo ini, kami menyampaikan pengajuan
                                deviasi harga Cetak kartu / E - Card / Biaya
                                langganan* Standard Retail Price (SRP), untuk{" "}
                                <span ref={animatePartnerNameRef}>
                                    {data.partner.name ?? "{{lembaga}}"}
                                </span>{" "}
                                dengan detail sebagai berikut :
                            </p>

                            <div className="w-full mt-5 mx-10">
                                <ol className="list-decimal">
                                    <li className="w-full">
                                        <div className="flex w-full">
                                            <p className="w-[20%]">
                                                Harga cetak kartu
                                            </p>
                                            <p ref={animatePriceCardRef}>
                                                {data.price_card ??
                                                    "{{harga kartu}}"}
                                            </p>
                                        </div>
                                    </li>
                                    <li className="w-full">
                                        <div className="flex w-full">
                                            <p className="w-[20%]">E-Card</p>
                                            <p ref={animatePriceECardRef}>
                                                {data.price_e_card ??
                                                    "{{harga e-card}}"}
                                            </p>
                                        </div>
                                    </li>
                                    <li className="w-full">
                                        <div className="flex w-full">
                                            <p className="w-[20%]">
                                                Biaya Langganan
                                            </p>
                                            <p
                                                ref={
                                                    animatePriceSubscriptionRef
                                                }
                                            >
                                                {data.price_subscription ??
                                                    "{{biaya langganan}}"}
                                            </p>
                                        </div>
                                    </li>
                                </ol>
                            </div>

                            <div className="flex flex-col w-full mt-5">
                                <p>
                                    Adapun pertimbangan pengajuan ini adalah :
                                </p>
                                <p
                                    className="text-justify indent-10"
                                    style={{ textIndent: "27px" }}
                                    ref={animateConsiderationRef}
                                >
                                    {data.consideration ?? "{{pertimbangan}}"}
                                </p>
                            </div>

                            <div className="flex w-full mt-5 text-justify">
                                <p>
                                    Demikian Memo Pengajuan deviasi kami
                                    sampaikan. Atas perhatian dan kerja samanya,
                                    kami ucapkan terima kasih.
                                </p>
                            </div>

                            <div className="w-full text-center mt-5">
                                <p>
                                    Purwokerto,{" "}
                                    {new Date().toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>

                            <div className="flex justify-around mt-5">
                                <div
                                    className="text-center w-[33%]"
                                    ref={animateSignatureFirstRef}
                                >
                                    <p>Yang Mengajukan</p>
                                    {data.signature_applicant.image ? (
                                        <>
                                            <div className="h-[100px] w-[170px] mx-auto py-2">
                                                <img
                                                    src={`/storage/${data.signature_applicant.image}`}
                                                    alt=""
                                                    className="min-h-20 w-full h-full object-fill"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div
                                            style={{ minHeight: "100px" }}
                                        ></div>
                                    )}
                                    <p>{data.signature_applicant.name}</p>
                                </div>
                                <div
                                    className="text-center w-[33%]"
                                    ref={animateSignatureSecondRef}
                                >
                                    <p>Mengetahui</p>
                                    {data.signature_acknowledges.image ? (
                                        <>
                                            <div className="h-[100px] w-[170px] mx-auto py-2">
                                                <img
                                                    src={`/storage/${data.signature_acknowledges.image}`}
                                                    alt=""
                                                    className="min-h-20 w-full h-full object-fill"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div
                                            style={{ minHeight: "100px" }}
                                        ></div>
                                    )}
                                    <p>{data.signature_acknowledges.name}</p>
                                </div>
                                <div
                                    className="text-center w-[33%]"
                                    ref={animateSignatureThirdRef}
                                >
                                    <p>Menyetujui</p>
                                    {data.signature_agrees.image ? (
                                        <>
                                            <div className="h-[100px] w-[170px] mx-auto py-2">
                                                <img
                                                    src={`/storage/${data.signature_agrees.image}`}
                                                    alt=""
                                                    className="min-h-20 w-full h-full object-fill"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div
                                            style={{ minHeight: "100px" }}
                                        ></div>
                                    )}
                                    <p>{data.signature_agrees.name}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </BlockUI>

            <DialogInstitution
                dialogInstitutionVisible={dialogInstitutionVisible}
                setDialogInstitutionVisible={setDialogInstitutionVisible}
                filters={filters}
                setFilters={setFilters}
                isLoadingData={isLoadingData}
                setIsLoadingData={setIsLoadingData}
                leads={leads}
                setLeads={setLeads}
                partners={partners}
                setPartners={setPartners}
                data={data}
                setData={setData}
                reset={reset}
                setProvinceName={setProvinceName}
            />
        </>
    );
};

export default Edit;
