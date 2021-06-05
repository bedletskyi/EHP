import React from 'react';
import { Table, Modal } from 'semantic-ui-react';
import './pricemodal.css';

// eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-assignment
const { shell } = require('electron');

const headers = ['№', 'Name', 'Price'];
export const PriceModal = ({
  showPriceModal,
  closePriceModal,
  price,
}) => {
  return (
    <Modal size="small" open={showPriceModal} onClose={() => closePriceModal()}>
      <Modal.Header>Products Price</Modal.Header>
      <Modal.Content className="priceModalContent">
        <Table celled padded>
          <Table.Header>
            <Table.Row>
              {headers.map((header, i) => (
                <Table.HeaderCell key={i}>{header}</Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {price.map((row, i) => (
              <Table.Row key={i}>
                <Table.Cell>{i + 1}</Table.Cell>
                <Table.Cell>
                  <a
                    href="#"
                    className="externalLink"
                    onClick={() => shell.openExternal(row.link)}
                  >
                    {row.name}
                  </a>
                </Table.Cell>
                <Table.Cell textAlign="right">{row.price}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Modal.Content>
    </Modal>
  );
};
