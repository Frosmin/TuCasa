interface Props {
  url: string;
}

const PDFViewer = ({ url }: Props) => {
  return (
    <div className="w-full h-screen">
      <iframe
        src={url}
        width="100%"
        height="100%"
        style={{ border: "none" }}
        title="Manual de Usuario"
      />
    </div>
  );
};

export default PDFViewer;
