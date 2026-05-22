
export const styles = {
    app: {
      minHeight: '100vh',
      background: '#eef2f7',
      display: 'flex',
      justifyContent: 'center',
      fontFamily: 'Arial',
    },
  
    telefono: {
      width: '100%',
      maxWidth: '430px',
      minHeight: '100vh',
      background: '#f7f8fb',
    },
  
    loginContainer: {
      minHeight: '100vh',
      background:
        'linear-gradient(180deg, #6da9d7 0%, #eef5fb 32%, #ffffff 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '32px 16px 22px',
      boxSizing: 'border-box',
    },
  
    loginLogo: {
      width: '125px',
      height: '125px',
      objectFit: 'contain',
      marginBottom: '8px',
    },
  
    loginTitulo: {
      color: '#21123f',
      fontSize: '28px',
      fontWeight: '800',
      margin: '4px 0 8px',
    },
  
    loginSubtitulo: {
      color: '#21123f',
      fontSize: '18px',
      textAlign: 'center',
      margin: '0 0 20px',
    },
  
    roleBox: {
      width: '100%',
      background: 'white',
      borderRadius: '18px',
      padding: '14px',
      marginBottom: '16px',
      boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
      boxSizing: 'border-box',
    },
  
    roleTitle: {
      margin: '0 0 10px',
      textAlign: 'center',
      color: '#1d1d45',
      fontWeight: 'bold',
    },
  
    roleButtons: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '8px',
    },
  
    roleBtn: {
      background: '#f3f5fb',
      color: '#334499',
      border: '1px solid #dce1ee',
      padding: '11px',
      borderRadius: '20px',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
  
    roleBtnActivo: {
      background: '#334499',
      color: 'white',
      border: '1px solid #334499',
      padding: '11px',
      borderRadius: '20px',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
  
    loginBox: {
      width: '100%',
      background: 'white',
      borderRadius: '18px',
      padding: '22px 18px 18px',
      boxShadow: '0 8px 22px rgba(0,0,0,0.08)',
      textAlign: 'left',
      boxSizing: 'border-box',
    },
  
    loginLabel: {
      display: 'block',
      color: '#21123f',
      fontSize: '15px',
      marginBottom: '6px',
    },
  
    loginInput: {
      width: '100%',
      padding: '14px',
      border: 'none',
      borderBottom: '1px solid #d7def0',
      background: '#ffffff',
      color: '#082567',
      fontSize: '16px',
      outline: 'none',
    },
  
    loginButton: {
      width: '100%',
      marginTop: '18px',
      padding: '14px',
      border: 'none',
      borderRadius: '24px',
      background: '#3949ab',
      color: '#fff',
      fontWeight: '800',
      fontSize: '16px',
      boxShadow: '0 6px 12px rgba(0,0,0,0.18)',
    },
  
    forgotButton: {
      width: '100%',
      textAlign: 'left',
      background: 'transparent',
      border: 'none',
      color: '#9a98a7',
      fontSize: '16px',
      margin: '18px 0 55px',
      cursor: 'pointer',
    },
  
    createAccountButton: {
      width: '100%',
      background: 'white',
      color: '#334499',
      border: '2px solid #334499',
      padding: '14px',
      borderRadius: '28px',
      fontSize: '18px',
      fontWeight: '700',
      boxShadow: '0 4px 8px rgba(0,0,0,0.10)',
      cursor: 'pointer',
    },
  
    registroContainer: {
      padding: '25px 16px 40px',
    },
  
    padreContainer: {
      minHeight: '100vh',
      background: '#f4f6fb',
      padding: '0 10px 90px',
      overflowY: 'auto',
    },
  
    padreHeader: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      height: '82px',
      background: '#082567',
      borderBottomLeftRadius: '18px',
      borderBottomRightRadius: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 22px',
    },
  
    menuBtn: {
      background: 'transparent',
      color: 'white',
      border: 'none',
      fontSize: '28px',
      cursor: 'pointer',
    },
  
    headerLogo: {
      width: '82px',
      height: '82px',
      objectFit: 'contain',
    },
  
    avatarBtn: {
      width: '38px',
      height: '38px',
      borderRadius: '50%',
      background: '#ff3f7f',
      color: 'white',
      border: 'none',
      fontWeight: 'bold',
    },
  
    padreMainCard: {
      marginTop: '22px',
      marginBottom: '18px',
      background: '#ffffff',
      borderRadius: '18px',
      padding: '18px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
    },
  
    fotoDeportista: {
      width: '110px',
      height: '110px',
      minWidth: '110px',
      borderRadius: '18px',
      overflow: 'hidden',
      background: '#e9eefc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #d8e0ff',
    },
  
    fotoDeportistaImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
      borderRadius: '18px',
    },
  
    inicialesFoto: {
      fontSize: '28px',
      fontWeight: '800',
      color: '#334499',
    },
  
    padreMainInfo: {
      flex: 1,
      textAlign: 'center',
    },
  
    categoriaTexto: {
      color: '#1d1d45',
      fontWeight: '800',
      fontSize: '12px',
      textTransform: 'uppercase',
    },
  
    nombreDeportista: {
      color: '#1d1d45',
      fontSize: '22px',
      margin: '8px 0 0',
    },
  
    accesoTexto: {
      color: '#1d1d45',
      fontSize: '12px',
      margin: '2px 0 0',
    },
  
    gridResumen: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '14px',
      marginTop: '18px',
      marginBottom: '18px',
    },
  
    entrenadorCard: {
      background: '#ffffff',
      borderRadius: '18px',
      padding: '18px',
      textAlign: 'center',
      color: '#082567',
      boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
    },
  
    resumenCard: {
      background: '#ffffff',
      borderRadius: '16px',
      padding: '18px',
      textAlign: 'center',
      color: '#082567',
      boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
    },
  
    seccionTitulo: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '20px',
      marginBottom: '10px',
      color: '#082567',
    },
  
    linkPagoCard: {
      background: 'white',
      margin: '0 10px',
      borderRadius: '14px',
      padding: '18px',
      display: 'grid',
      gridTemplateColumns: '52px 1fr 35px',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 5px 14px rgba(0,0,0,0.08)',
      cursor: 'pointer',
    },
  
    pseCircle: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: '#005493',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
    },
  
    eventosGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px',
      padding: '0 10px',
    },
  
    eventoCard: {
      background: '#0b7c61',
      color: 'white',
      borderRadius: '10px',
      height: '95px',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '18px',
      fontWeight: 'bold',
    },
  
    portalTitleCard: {
      background: '#ffffff',
      borderRadius: '18px',
      padding: '18px',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      marginBottom: '18px',
      boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
      color: '#082567',
    },
  
    portalIcon: {
      width: '42px',
      height: '42px',
      borderRadius: '12px',
      background: '#edf2ff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#334499',
      fontWeight: 'bold',
    },
  
    detalleCard: {
      background: 'white',
      margin: '14px',
      borderRadius: '16px',
      padding: '14px',
      boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
    },
  
    badgeCategoria: {
      background: '#ff3f7f',
      color: 'white',
      borderRadius: '20px',
      padding: '8px 16px',
      fontWeight: 'bold',
      width: 'fit-content',
      margin: '0 auto 8px',
      fontSize: '12px',
      textTransform: 'uppercase',
    },
  
    detalleTop: {
      display: 'grid',
      gridTemplateColumns: '100px 1fr',
      gap: '12px',
      alignItems: 'center',
    },
  
    subirFotoBox: {
      height: '110px',
      background: '#edf4ff',
      border: '1px solid #dbe4f7',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '11px',
      fontWeight: 'bold',
      color: '#002f7e',
      cursor: 'pointer',
      overflow: 'hidden',
    },
  
    fotoPreview: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    },
  
  resumenCard: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '18px',
    textAlign: 'center',
    color: '#082567',
    boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
  },
  
    nombreBox: {
      background: '#f7f9ff',
      border: '1px solid #dbe4f7',
      borderRadius: '12px',
      padding: '16px',
      textAlign: 'center',
  
    },
  
    infoLine: {
      display: 'flex',
      justifyContent: 'space-between',
      borderBottom: '1px solid #e8e8ef',
      padding: '9px 4px',
      fontSize: '13px',
    },
  
    carnetBox: {
      marginTop: '12px',
      background: '#002366',
      color: 'white',
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '25px',
    },
  
    qrBox: {
      background: 'white',
      color: '#002366',
      width: '58px',
      height: '58px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
    },
  
    editHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '10px',
    },
  
    subtituloAzul: {
      textAlign: 'center',
      color: '#002f7e',
      fontSize: '18px',
    },
  
    dataSection: {
      background: '#f7f9ff',
      border: '1px solid #dbe4f7',
      borderRadius: '12px',
      padding: '14px',
      marginTop: '12px',
      textAlign: 'center',
    },
  
    dataGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px',
    },
  
    dataItem: {
      background: 'white',
      border: '1px solid #dde4f5',
      borderRadius: '8px',
      padding: '12px 6px',
      minHeight: '60px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
  
    pageIntro: {
      textAlign: 'center',
      color: '#6e6a7d',
      fontSize: '13px',
      padding: '0 18px',
    },
  
    pagoItemCard: {
      background: 'white',
      margin: '14px',
      borderRadius: '14px',
      padding: '18px',
      display: 'grid',
      gridTemplateColumns: '52px 1fr 55px',
      alignItems: 'center',
      gap: '10px',
      boxShadow: '0 5px 14px rgba(0,0,0,0.08)',
    },
  
    pagoInfo: {
      textAlign: 'center',
    },
  
    pagarBtn: {
      background: '#334499',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 10px',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
  
    eventoGrandeCard: {
      background: '#082567',
      color: 'white',
      margin: '14px',
      borderRadius: '14px',
      padding: '20px',
      minHeight: '95px',
      boxShadow: '0 5px 14px rgba(0,0,0,0.08)',
    },
  
    alertaProteccion: {
      background: '#eefaff',
      border: '1px dashed #008d9c',
      margin: '14px',
      borderRadius: '14px',
      padding: '18px',
      display: 'flex',
      gap: '14px',
      alignItems: 'center',
      textAlign: 'center',
    },
  
    documentoCard: {
      background: 'white',
      margin: '14px',
      borderRadius: '14px',
      padding: '18px',
      display: 'grid',
      gridTemplateColumns: '1fr 45px',
      alignItems: 'center',
      gap: '10px',
      textAlign: 'center',
      boxShadow: '0 5px 14px rgba(0,0,0,0.08)',
    },
  
    bottomNav: {
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '430px',
      height: '64px',
      background: 'white',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      boxShadow: '0 -4px 14px rgba(0,0,0,0.08)',
      zIndex: 20,
    },
  
    navItem: {
      background: 'transparent',
      border: 'none',
      color: '#1d1d45',
      fontSize: '12px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2px',
      cursor: 'pointer',
    },
  
    navItemActivo: {
      background: 'transparent',
      border: 'none',
      color: '#334499',
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2px',
      cursor: 'pointer',
    },
  
    errorText: {
      color: '#b00020',
      fontSize: '13px',
    },
  
    logo: {
      width: '120px',
      display: 'block',
      margin: '0 auto 10px',
    },
  
    titulo: {
      textAlign: 'center',
      color: '#1d1d45',
      marginBottom: '5px',
    },
  
    subtitulo: {
      textAlign: 'center',
      color: '#777',
      marginBottom: '20px',
    },
  
    card: {
      background: 'white',
      borderRadius: '18px',
      padding: '18px',
      margin: '18px',
      boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
    },
  
    sectionTitle: {
      marginTop: '20px',
      color: '#334499',
    },
  
    formLabel: {
      display: 'block',
      marginBottom: '14px',
    },
  
    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '12px',
      border: '1px solid #d7def0',
      background: '#ffffff',
      color: '#082567',
      fontSize: '15px',
      outline: 'none',
    },
  
    legalRow: {
      display: 'flex',
      gap: '10px',
      marginBottom: '14px',
      alignItems: 'flex-start',
    },
  
    boton: {
      width: '100%',
      background: '#334499',
      color: 'white',
      border: 'none',
      padding: '15px',
      borderRadius: '25px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '10px',
    },
  
    botonSecundario: {
      width: 'calc(100% - 36px)',
      margin: '10px 18px',
      background: 'white',
      color: '#334499',
      border: '1px solid #334499',
      padding: '14px',
      borderRadius: '25px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
  
    volverBtn: {
      border: 'none',
      background: 'transparent',
      color: '#334499',
      fontWeight: 'bold',
      marginBottom: '10px',
      cursor: 'pointer',
    },
  
    okContainer: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
  
    okCard: {
      background: 'white',
      padding: '30px',
      borderRadius: '18px',
      textAlign: 'center',
      boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
    },
  
    infoBox: {
      background: '#eef4ff',
      border: '1px solid #d7e4ff',
      color: '#334499',
      padding: '12px',
      borderRadius: '10px',
      fontSize: '14px',
      marginBottom: '15px',
    },
  
    adminLayout: {
      minHeight: '100vh',
      display: 'flex',
      background: '#f4f6fb',
    },
  
    adminSidebar: {
      width: '145px',
      background: '#002366',
      color: 'white',
      padding: '14px 10px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
  
    adminLogo: {
      width: '90px',
      margin: '0 auto 14px',
    },
  
    adminContent: {
      flex: 1,
      padding: '18px',
      overflowY: 'auto',
    },
  
    adminMenuBtn: {
      background: 'transparent',
      color: 'white',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: '10px',
      padding: '10px 8px',
      textAlign: 'left',
      fontSize: '12px',
      cursor: 'pointer',
    },
  
    adminMenuActivo: {
      background: 'white',
      color: '#002366',
      border: '1px solid white',
      borderRadius: '10px',
      padding: '10px 8px',
      textAlign: 'left',
      fontSize: '12px',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
  
    adminLogout: {
      marginTop: 'auto',
      background: '#ff3f7f',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      padding: '10px',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
  
    resumenCard: {
      background: '#ffffff',
      borderRadius: '16px',
      padding: '18px',
      textAlign: 'center',
      color: '#082567',
      boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
    },
    
    adminTitle: {
      fontSize: 38,
      fontWeight: 800,
      color: '#082567',
    },
  
    adminCardsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: '12px',
      marginBottom: '16px',
    },
  
    adminCard: {
      background: '#fff',
      borderRadius: '14px',
      padding: '16px',
      boxShadow: '0 5px 14px rgba(0,0,0,0.08)',
      textAlign: 'center',
    },
  
    adminPanel: {
      background: 'white',
      borderRadius: '14px',
      padding: '14px',
      marginBottom: '14px',
      boxShadow: '0 5px 14px rgba(0,0,0,0.08)',
      overflowX: 'auto',
    },
  
    adminTable: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '13px',
    },
  
    adminTh: {
      textAlign: 'left',
      borderBottom: '1px solid #dce1ee',
      padding: '8px',
      color: '#334499',
    },
  
    adminTd: {
      borderBottom: '1px solid #edf0f7',
      padding: '8px',
    },
  
    adminListItem: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '10px',
      alignItems: 'center',
      borderBottom: '1px solid #edf0f7',
      padding: '12px 0',
    },
  
    adminActions: {
      display: 'flex',
      gap: '6px',
      flexWrap: 'wrap',
    },
  
    adminSmallBtn: {
      background: '#334499',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 10px',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '12px',
    },
  
    adminSmallBtnDanger: {
      background: '#ff3f7f',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 10px',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '12px',
    },
  
    adminPage: {
      minHeight: '100vh',
      background: '#f4f5fb',
      width: '100%',
      maxWidth: '430px',
    },
  
    adminTopbar: {
      background: '#002366',
      height: '82px',
      borderBottomLeftRadius: '18px',
      borderBottomRightRadius: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      width: '100%',
      boxSizing: 'border-box',
    },
  
    menuHamburguesa: {
      background: 'transparent',
      border: 'none',
      color: 'white',
      fontSize: '28px',
      cursor: 'pointer',
    },
  
    logoTopbar: {
      width: '82px',
    },
  
    adminAvatar: {
      width: '42px',
      height: '42px',
      borderRadius: '50%',
      background: '#ff3f7f',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
    },
  
    sidebarFloating: {
      position: 'fixed',
      top: '95px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 32px)',
      maxWidth: '390px',
      background: '#002366',
      padding: '18px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      zIndex: 999,
      borderRadius: '18px',
      boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
      boxSizing: 'border-box',
    },
  
    sidebarBtn: {
      background: 'transparent',
      border: '1px solid rgba(255,255,255,0.2)',
      color: 'white',
      borderRadius: '12px',
      padding: '12px',
      textAlign: 'left',
      fontWeight: '600',
      cursor: 'pointer',
    },
  
    sidebarBtnActive: {
      background: 'white',
      border: '1px solid white',
      color: '#002366',
      borderRadius: '12px',
      padding: '12px',
      textAlign: 'left',
      fontWeight: '700',
      cursor: 'pointer',
    },
  
    sidebarLogout: {
      marginTop: 'auto',
      background: '#ff3f7f',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '12px',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
  
    adminBody: {
      width: '100%',
      padding: '14px',
      boxSizing: 'border-box',
    },
  
    adminOverlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.35)',
      zIndex: 150,
    },
  
    adminOverlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.35)',
      zIndex: 150,
    },
  
    adminShell: {
      width: '100%',
      minHeight: '100vh',
      background: '#f4f5fb',
      display: 'flex',
      justifyContent: 'center',
    },
  
    adminHeaderInline: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '14px',
    },
  
    adminPlusBtn: {
      width: '42px',
      height: '42px',
      borderRadius: '50%',
      border: 'none',
      background: '#334499',
      color: 'white',
      fontSize: '28px',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 5px 14px rgba(0,0,0,0.15)',
    },
  
    adminCardButton: {
      background: 'white',
      border: 'none',
      borderRadius: '14px',
      padding: '16px',
      boxShadow: '0 5px 14px rgba(0,0,0,0.08)',
      textAlign: 'center',
      cursor: 'pointer',
      color: '#1d1d45',
    },
  
    adminGrid2: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px',
    },
  
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: '#1d1d45',
      margin: '8px 0 14px',
    },
  
    agendaCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      background: '#f6f7fb',
      borderRadius: '16px',
      padding: '12px',
      marginBottom: '12px',
    },
  
    agendaFecha: {
      width: '54px',
      height: '58px',
      borderRadius: '14px',
      background: '#334499',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
  
    agendaContenido: {
      flex: 1,
    },
  
    agendaTipo: {
      color: '#ff3f7f',
      fontWeight: '700',
      textTransform: 'uppercase',
    },
  
    estadoSelect: {
      border: '1px solid #d9dcec',
      borderRadius: '10px',
      padding: '8px',
      minWidth: '120px',
    },
  
    eventoInicioCard: {
      background: '#112b7a',
      color: 'white',
      borderRadius: '10px',
      padding: '14px 12px',
      minHeight: '95px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: '6px',
      textAlign: 'center',
    },
  
    eventoInicioTitulo: {
      fontSize: '15px',
      fontWeight: '800',
    },
  
    eventoInicioFecha: {
      fontSize: '13px',
      fontWeight: '700',
    },
  
    eventoInicioHora: {
      fontSize: '12px',
      opacity: 0.95,
    },
  
    eventoAcciones: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      marginTop: '12px',
      width: '110px',
    },
  
    botonSecundario: {
      width: '100%',
      border: 'none',
      borderRadius: '12px',
      background: '#3554d1',
      color: '#fff',
      padding: '10px',
      fontWeight: '700',
      fontSize: '13px',
    },
  
    botonCancelar: {
      width: '100%',
      border: 'none',
      borderRadius: '12px',
      background: '#d64545',
      color: '#fff',
      padding: '10px',
      fontWeight: '700',
      fontSize: '13px',
    },
  
    novedadEvento: {
      marginTop: '10px',
      background: '#fff3cd',
      color: '#856404',
      padding: '10px',
      borderRadius: '10px',
      fontSize: '13px',
      fontWeight: '600',
    },
  
    modalInterno: {
      background: 'white',
      borderRadius: '18px',
      padding: '18px',
      margin: '16px 0',
      boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
    },
  
    botonCancelarFull: {
      width: '100%',
      border: 'none',
      borderRadius: '14px',
      background: '#d64545',
      color: '#fff',
      padding: '12px',
      fontWeight: '800',
      marginTop: '10px',
    },
    historialSection: {
      marginTop: '24px',
    },
  
    subtituloSeccion: {
      fontSize: '18px',
      fontWeight: '800',
      marginTop: '18px',
      marginBottom: '12px',
      color: '#ffffff',
      textAlign: 'center',
    },
  
    cardHistorial: {
      background: '#fff',
      borderRadius: '18px',
      padding: '16px',
      marginBottom: '14px',
      boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
    },
  
    historialFecha: {
      color: '#6c757d',
      fontWeight: '700',
    },
  
    estadoAsistencia: {
      marginTop: '12px',
      padding: '10px',
      borderRadius: '12px',
      fontWeight: '800',
      textAlign: 'center',
    },
  
    asistenciaEventoPadre: {
      marginTop: '12px',
      background: '#ffffff',
      color: '#082567',
      borderRadius: '12px',
      padding: '10px',
      fontWeight: '800',
      textAlign: 'center',
    },
  
    menuPadre: {
      position: 'absolute',
      top: '80px',
      left: '20px',
      right: '20px',
      background: '#082567',
      borderRadius: '18px',
      padding: '16px',
      zIndex: 100,
      boxShadow: '0 12px 24px rgba(0,0,0,0.25)',
    },
  
    botonFiltroEventos: {
      width: '100%',
      border: 'none',
      borderRadius: '14px',
      background: '#082567',
      color: '#fff',
      padding: '12px',
      fontWeight: '800',
      marginBottom: '14px',
    },
  
    asistenciaFila: {
      background: '#f4f6fb',
      borderRadius: '14px',
      padding: '12px',
      marginBottom: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
  
    asistenciaSelect: {
      width: '100%',
      border: '1px solid #d7def0',
      borderRadius: '12px',
      padding: '10px',
      fontSize: '14px',
    },
  
    documentoCard: {
      background: '#ffffff',
      borderRadius: '20px',
      padding: '18px',
      marginBottom: '16px',
      boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
    },
  
    documentoHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
    },
  
    estadoDocumento: {
      padding: '6px 12px',
      borderRadius: '999px',
      fontWeight: '700',
      fontSize: '12px',
    },
  
    botonVerDocumento: {
      display: 'inline-block',
      marginTop: '14px',
      background: '#082567',
      color: '#fff',
      padding: '10px 16px',
      borderRadius: '12px',
      textDecoration: 'none',
      fontWeight: '700',
    },
  
    adminPanelAgenda: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '18px',
    },
  
    agendaAdminCard: {
      width: '100%',
      maxWidth: '560px',
      background: '#fff',
      borderRadius: '22px',
      padding: '22px',
      boxShadow: '0 8px 22px rgba(0,0,0,0.08)',
      textAlign: 'center',
    },
  
    agendaAdminRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
      padding: '12px 0',
      borderBottom: '1px solid #edf0f7',
      textAlign: 'left',
    },
  
    agendaAdminNovedad: {
      marginTop: '16px',
      color: '#c1121f',
      fontWeight: '800',
      textAlign: 'center',
    },
  
    eventoAcciones: {
      display: 'flex',
      gap: '6px',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginTop: '12px',
      width: '100%',
    },
    
    botonMini: {
      flex: '1',
      minWidth: '82px',
      border: 'none',
      borderRadius: '10px',
      background: '#3949ab',
      color: '#fff',
      padding: '9px 6px',
      fontWeight: '800',
      fontSize: '12px',
    },
    
    botonMiniDanger: {
      flex: '1',
      minWidth: '82px',
      border: 'none',
      borderRadius: '10px',
      background: '#d64545',
      color: '#fff',
      padding: '9px 6px',
      fontWeight: '800',
      fontSize: '12px',
    },
  
    modalInternoGrande: {
      background: '#fff',
      borderRadius: '22px',
      padding: '22px',
      width: '92%',
      maxHeight: '85vh',
      overflowY: 'auto',
    },
  
    listaAsistencia: {
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      marginTop: '18px',
    },
  
    cardAsistencia: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: '#f4f6fb',
      borderRadius: '16px',
      padding: '12px',
    },
  
    asistenciaInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
  
    asistenciaBtns: {
      display: 'flex',
      gap: '8px',
    },
  
    btnAsistio: {
      border: 'none',
      background: '#2d6a4f',
      color: '#fff',
      borderRadius: '10px',
      padding: '10px 14px',
      fontSize: '18px',
    },
  
    btnNoAsistio: {
      border: 'none',
      background: '#c1121f',
      color: '#fff',
      borderRadius: '10px',
      padding: '10px 14px',
      fontSize: '18px',
    },
  
    modalInternoGrande: {
      background: '#fff',
      borderRadius: '22px',
      padding: '22px',
      width: '92%',
      maxHeight: '85vh',
      overflowY: 'auto',
    },
  
    itemAsistencia: {
      background: '#f4f6fb',
      borderRadius: '14px',
      padding: '12px',
      marginBottom: '12px',
    },
  
    btnAsistio: {
      flex: 1,
      border: 'none',
      borderRadius: '10px',
      background: '#22c55e',
      color: '#fff',
      padding: '10px',
      fontWeight: '800',
    },
    
    btnNoAsistio: {
      flex: 1,
      border: 'none',
      borderRadius: '10px',
      background: '#ef4444',
      color: '#fff',
      padding: '10px',
      fontWeight: '800',
    },
    entrenadorNombre: {
      color: '#082567',
      fontWeight: '900',
    },
    
    entrenadorTexto: {
      color: '#4f5d75',
    },
    
    entrenadorNumero: {
      color: '#082567',
      fontWeight: '900',
      fontSize: '26px',
    },
    
    entrenadorTituloCard: {
      color: '#082567',
      fontWeight: '800',
    },
    
  };
  
  
  
  