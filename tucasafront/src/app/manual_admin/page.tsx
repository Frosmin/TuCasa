import PDFViewer from "@/components/pdf_view/page"

const ManualAdmin = () =>{
    const url=process.env.NEXT_PUBLIC_ADMIN_MANUAL || "";
    return <PDFViewer url={url}/>
}

export default ManualAdmin;