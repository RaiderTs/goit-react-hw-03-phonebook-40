import { Component } from 'react';
import './App.styled.jsx';
import ContactList from './components/ContactList';
import ContactForm from './components/ContactForm';
import Filter from './components/Filter';
import swal from 'sweetalert';
import { Section, Title, SubTitle } from './App.styled';
class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);

    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const prevContacts = prevState.contacts;
    const nextContacts = this.state.contacts;
    if (prevContacts !== nextContacts)
      localStorage.setItem('contacts', JSON.stringify(nextContacts));
  }

  handleFilterContacts = () => {
    const { contacts } = this.state;
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(this.state.filter.toLowerCase()),
    );
  };

  handleFilterChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };

  handleCheckUnique = name => {
    const { contacts } = this.state;
    const onExistContact = contacts.some(contact => contact.name === name);
    onExistContact &&
      swal(`${name} is already in contacts!`, {
        icon: 'error',
        buttons: false,
        timer: 2500,
      });
    return !onExistContact;
  };

  handleRemoveContact = id => {
    this.setState(({ contacts }) => ({
      contacts: contacts.filter(contact => contact.id !== id),
    }));
  };

  handleAddContact = contact => {
    this.setState(({ contacts }) => ({
      contacts: [...contacts, contact],
    }));
  };

  render() {
    return (
      <Section>
        <Title>Phone book</Title>
        <ContactForm
          addContact={this.handleAddContact}
          onUnique={this.handleCheckUnique}
        />
        <SubTitle>Contacts</SubTitle>
        <Filter filter={this.state.filter} onChange={this.handleFilterChange} />
        <ContactList
          contacts={this.handleFilterContacts()}
          onDeleteContact={this.handleRemoveContact}
        />
      </Section>
    );
  }
}

export default App;
