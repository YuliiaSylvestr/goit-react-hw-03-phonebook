import { Component } from 'react';
import { nanoid } from 'nanoid';
import ContactForm from './ContactForm/ContactForm';
import Filter from './Filter/FIlter';
import ContactList from './ContactList/ContactList';

class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
      this.setState({ contacts: JSON.parse(savedContacts) });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.contacts.length !== this.state.contacts.length) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  handleAddContact = values => {
    const { contacts } = this.state;
    const isContactExists = contacts.some(
      ({ name }) => name.toLowerCase() === values.name.toLowerCase()
    );
    if (isContactExists) {
      alert(`${values.name} is already in contacts!`);
      return;
    }
    const newContact = {
      ...values,
      id: nanoid(),
    };
    this.setState(prevState => ({
      contacts: [...prevState.contacts, newContact],
    }));
  };

  handleDeleteContact = deletedId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(({ id }) => deletedId !== id),
    }));
  };

  getFilteredContacts = () => {
    const { contacts, filter } = this.state;
    return contacts.filter(({ name }) =>
      name.toLowerCase().includes(filter.toLowerCase().trim())
    );
  };

  handleFilter = value => this.setState({ filter: value });

  render() {
    const { filter } = this.state;
    const filteredContacts = this.getFilteredContacts();
    return (
      <div>
        <h2>Phonebook</h2>
        <ContactForm onAddContact={this.handleAddContact} />

        <h2>Contacts</h2>

        <Filter filter={filter} onFilter={this.handleFilter} />

        <ContactList
          contacts={filteredContacts}
          onDelete={this.handleDeleteContact}
        />
      </div>
    );
  }
}

export default App;
