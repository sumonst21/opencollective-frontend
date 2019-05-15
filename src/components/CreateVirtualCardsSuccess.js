import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { Flex, Box } from '@rebass/grid';

import { Clipboard } from 'styled-icons/feather/Clipboard';
import { CheckCircle } from 'styled-icons/fa-regular/CheckCircle';
import { Printer } from 'styled-icons/feather/Printer';

import { P } from './Text';
import StyledInput from './StyledInput';
import StyledButton from './StyledButton';

const RedeemLinksTextarea = styled(StyledInput).attrs({ as: 'textarea' })`
  width: 95%;
  max-width: 450px;
  min-height: 175px;
  padding: 8px;
  border-radius: 8px;
  resize: vertical;
  overflow-wrap: normal;
`;

/**
 * Displays created gift cards, with an option to print them.
 */
export default class CreateVirtualCardsSuccess extends React.Component {
  static propTypes = {
    cards: PropTypes.arrayOf(
      PropTypes.shape({
        uuid: PropTypes.string.isRequired,
        currency: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        expiryDate: PropTypes.string,
      }),
    ).isRequired,
    deliverType: PropTypes.oneOf(['manual', 'email']).isRequired,
    collectiveSlug: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.redeemLinkTextareaRef = React.createRef();
  }

  getRedeemLinkFromVC(vc) {
    return `${process.env.WEBSITE_URL}/redeem/${vc.uuid.split('-')[0]}`;
  }

  copyLinksToClipboard = () => {
    try {
      this.redeemLinkTextareaRef.current.select();
      document.execCommand('copy');
    } catch (e) {
      console.error('Cannot copy to clipboard', e);
    }
  };

  renderManualSuccess() {
    return (
      <React.Fragment>
        <Box mb={3}>
          <FormattedMessage
            id="virtualCards.create.successCreate"
            defaultMessage="Your {count, plural, one {gift card has} other {{count} gift cards have}} been created."
            values={{ count: this.props.cards.length }}
          />
        </Box>

        <Flex width={1} flexDirection="column" alignItems="center">
          <Flex my={3} flexWrap="wrap" justifyContent="center">
            <StyledButton
              m={2}
              minWidth={260}
              buttonSize="large"
              buttonStyle="primary"
              onClick={this.copyLinksToClipboard}
            >
              <Clipboard size="1em" />
              &nbsp;
              <FormattedMessage id="CreateVirtualCardsSuccess.RedeemLinks" defaultMessage="Copy the links" />
            </StyledButton>
            <StyledButton m={2} buttonSize="large" disabled>
              <Printer size="1em" />
              &nbsp;
              <FormattedMessage id="CreateVirtualCardsSuccess.Download" defaultMessage="Download cards" />
            </StyledButton>
          </Flex>
          <RedeemLinksTextarea
            ref={this.redeemLinkTextareaRef}
            className="result-redeem-links"
            readOnly
            value={this.props.cards.map(this.getRedeemLinkFromVC).join('\n')}
          />
        </Flex>
      </React.Fragment>
    );
  }

  renderEmailSuccess() {
    return (
      <FormattedMessage
        id="virtualCards.create.successSent"
        defaultMessage="Your {count, plural, one {gift card has} other {{count} gift cards have}} been sent!"
        values={{ count: this.props.cards.length }}
      />
    );
  }

  render() {
    const { deliverType } = this.props;

    return (
      <Flex flexDirection="column" alignItems="center">
        <P color="green.700">
          <CheckCircle size="3em" />
        </P>
        {deliverType === 'email' ? this.renderEmailSuccess() : this.renderManualSuccess()}
      </Flex>
    );
  }
}
