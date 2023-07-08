import Link from "next/link";
import ReactModal from "react-modal";

ReactModal.setAppElement("#__next");

interface InfoModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, closeModal }) => {
  const modalStyles = {
    content: {
      width: "50%",
      height: "25%",
      margin: "auto",
      background: "#f5f5f5",
      border: "none",
      borderRadius: "8px",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={modalStyles as ReactModal.Styles}
      shouldCloseOnOverlayClick={false}
    >
      <h2>Note</h2>
      <p>
        Currently migrating the legacy app, the main parts have moved over but
        there are some additional features like commenting, chat rooms, etc.
        which are missing. To view the legacy version see:&nbsp;
        <Link href="https://github.com/stevenxchung/AirCamp-App/releases/tag/v0.0.1">
          legacy-ejs-nodejs-app
        </Link>
        &nbsp;and the corresponding README for more information on how to run
        the app locally.
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button onClick={closeModal}>
          <h4>OK</h4>
        </button>
      </div>
    </ReactModal>
  );
};

export default InfoModal;
