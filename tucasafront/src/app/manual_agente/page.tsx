import PDFViewer from "@/components/pdf_view/page"

const ManualAgente = () =>{
    const url=process.env.NEXT_PUBLIC_AGENT_MANUAL || "";
    return <PDFViewer url={url}/>
}

export default ManualAgente;