export default function Home() {
  return (
    <div style={{ 
      fontFamily: 'Montserrat, sans-serif',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      padding: '20px'
    }}>
      <div style={{ width: '100%', maxWidth: '560px' }}>

        <form 
          action="/api/send-simple-form"
          method="POST"
          encType="multipart/form-data"
        >

          <div style={{ marginBottom: '18px' }}>
            <label>Nom</label>
            <input name="nom" type="text" required style={inputStyle}/>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label>Correu electrònic</label>
            <input name="email" type="email" required style={inputStyle}/>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label>Data de naixement</label>
            <input name="dataNaixement" type="date" required style={inputStyle}/>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label>DNI</label>
            <input name="dni" type="text" required style={inputStyle}/>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label>
              <input type="checkbox" name="prestacio" />
              {" "}Cobro una prestació
            </label>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <input type="file" name="fileInput" />
          </div>

          <button type="submit" style={buttonStyle}>
            Enviar
          </button>

        </form>

      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  height: "46px",
  padding: "0 16px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  marginTop: "6px"
};

const buttonStyle = {
  marginTop: "16px",
  background: "#d6002a",
  color: "white",
  border: "none",
  height: "48px",
  padding: "0 36px",
  borderRadius: "999px",
  fontWeight: "600",
  cursor: "pointer"
};
