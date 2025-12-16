import PDFViewer from "@/components/pdf_view/page";

const ManualUsuario=()=>{
    const url=process.env.NEXT_PUBLIC_USER_MANUAL || "";
    return <PDFViewer url={url}/>
}

export default ManualUsuario;