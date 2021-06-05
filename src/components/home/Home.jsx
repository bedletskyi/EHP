import React from 'react';
import {
  Button, Header, Icon, Modal, Progress,
} from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { exportParsedData, importExcelFile, startParsing } from './homeActions';
import {
  closePriceModal,
  closeProgressModal,
  openPriceModal,
} from './homeSlice';
import { PriceModal } from '../priceModal/PriceModal.jsx';
import './home.css';


const Home = ({
  startParsing,
  parsing,
  openPriceModal,
  closePriceModal,
  importExcelFile,
  haveLastParsedData,
  exportParsedData,
  showPriceModal,
  price,
  parsingProgress,
  showParsingProgress,
  closeProgressModal,
}) => {
  const handleStartClick = () => {
    if (!parsing) {
      startParsing();
    }
  };

  const handleCloseParsingModal = () => {
    if (parsing) {
      return;
    }
    closeProgressModal();
  };

  return (
    <>
      <div className="mainContainer">
        <div className="mainButtonsContainer">
          <Button
            onClick={handleStartClick}
            loading={parsing}
            disabled={!price.length}
            color="green"
            size="big"
          >
            Start
          </Button>
          <Button onClick={openPriceModal} color="blue" size="big">
            Price
          </Button>
          <Button onClick={importExcelFile} icon size="big">
            <Icon name="cloud upload" />
          </Button>
        </div>
        {haveLastParsedData && (
          <div className="uploadButtonContainer">
            <Button onClick={exportParsedData} circular icon size="big">
              <Icon name="download" />
            </Button>
          </div>
        )}
      </div>
      <PriceModal
        showPriceModal={showPriceModal}
        closePriceModal={closePriceModal}
        price={price}
      />
      <Modal
        size="small"
        basic
        open={showParsingProgress}
        onClose={handleCloseParsingModal}
      >
        <Header className="progress-header">
          {parsing ? 'Parsing Progress' : 'DONE! Parsing finished'}
        </Header>
        <Modal.Content className="progress-content">
          <Progress
            percent={parsingProgress}
            color="blue"
            indicating
            progress
          />
        </Modal.Content>
      </Modal>
    </>
  );
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      importExcelFile,
      closePriceModal,
      closeProgressModal,
      exportParsedData,
      openPriceModal,
      startParsing,
    },
    dispatch,
  );
}

function mapStateToProps(state) {
  return {
    showPriceModal: state.home.showPriceModal,
    showParsingProgress: state.home.showParsingProgress,
    price: state.home.price,
    parsing: state.home.parsing,
    parsingProgress: state.home.parsingProgress,
    haveLastParsedData: Boolean(state.home.lastParsedData.length),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
