function PdfTextLayer({ texts, scale }) {

    return (
        <div
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none"
            }}
        >
            {texts.map((element, index) => (

                <div
                    key={index}
                    contentEditable
                    suppressContentEditableWarning
                    style={{
                        position: "absolute",

                        left: `${element.x * scale}px`,

                        top: `${(element.y - element.height) * scale}px`,

                        width: `${element.width * scale}px`,

                        height: `${element.height * scale}px`,

                        fontSize: `${element.height * scale}px`,

                        lineHeight: 1,

                        whiteSpace: "nowrap",

                        pointerEvents: "auto",

                        background: "transparent",

                        border: "none",

                        outline: "none"
                    }}
                >
                    {element.text}
                </div>

            ))}
        </div>
    );
}

export default PdfTextLayer;