import React, { useState } from 'react';
import { Menu } from 'semantic-ui-react';

import './Menu.css';

const MainMenu = ({ account }) => {
  const [activeItem, setActiveItem] = useState('todoList');

  const handleItemClick = (e, { name }) => setActiveItem(name);

  return (
    <Menu id='main_menu'>
      <Menu.Item
        name='marketplace blockchain'
        active={activeItem === 'todoList'}
        onClick={handleItemClick}
      />
      <Menu.Menu position='right'>
        <Menu.Item
          name={`account`}
          active={activeItem === 'account'}
          onClick={handleItemClick}
        />
        <p className='account'>| {account}</p>
      </Menu.Menu>
    </Menu>
  );
};

export default MainMenu;
