interface Props {
  url: string;
}

const PDFViewer = ({ url }: Props) => {
  return (
    <div className="w-full h-screen flex items-center justify-center ">
      <iframe
        src={url}
        width="90%"
        height="90%"
        style={{ border: "none" }}
        title="Manual de Usuario"
      />
    </div>
  );
};

export default PDFViewer;
