import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';

import { I18nContext } from '../../../contexts/i18n';
import { Menu, MenuItem } from '../../ui/menu';
import { ICON_NAMES } from '../../component-library';

const NftOptions = ({ onRemove, onViewOnOpensea }) => {
  const t = useContext(I18nContext);
  const [nftOptionsButtonElement, setNftOptionsButtonElement] = useState(null);
  const [nftOptionsOpen, setNftOptionsOpen] = useState(false);

  return (
    <>
      <button
        className="fas fa-ellipsis-v nft-options__button"
        data-testid="nft-options__button"
        onClick={() => setNftOptionsOpen(true)}
        ref={setNftOptionsButtonElement}
      />
      {nftOptionsOpen ? (
        <Menu
          anchorElement={nftOptionsButtonElement}
          data-testid="close-nft-options-menu"
          onHide={() => setNftOptionsOpen(false)}
        >
          {onViewOnOpensea ? (
            <MenuItem
              iconName={ICON_NAMES.EXPORT}
              data-testid="nft-options__view-on-opensea"
              onClick={() => {
                setNftOptionsOpen(false);
                onViewOnOpensea();
              }}
            >
              {t('viewOnOpensea')}
            </MenuItem>
          ) : null}
          <MenuItem
            iconName={ICON_NAMES.TRASH}
            data-testid="nft-item-remove"
            onClick={() => {
              setNftOptionsOpen(false);
              onRemove();
            }}
          >
            {t('removeNFT')}
          </MenuItem>
        </Menu>
      ) : null}
    </>
  );
};

NftOptions.propTypes = {
  onRemove: PropTypes.func.isRequired,
  onViewOnOpensea: PropTypes.func,
};

export default NftOptions;
