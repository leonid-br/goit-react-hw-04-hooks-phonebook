import { Component } from 'react';
import shortid from 'shortid';
import ContactForm from './ContactForm';
import Filter from './Filter';
import ContactList from './ContactList';
import Container from './Container';
import Heading from './Heading';
import Notification from './Notification';

class App extends Component {
    state = {
        contacts: [],

        filter: '',
    };

    componentDidMount() {
        const parsedContacts = JSON.parse(localStorage.getItem('contacts'));

        if (parsedContacts) {
            this.setState({ contacts: parsedContacts });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { contacts } = this.state;
        if (contacts !== prevState.contacts) {
            localStorage.setItem('contacts', JSON.stringify(contacts));
        }
    }

    addContact = (name, number) => {
        const { contacts } = this.state;
        const normalizeName = name.toLowerCase();
        const checkedName = contacts.find(
            ({ name }) => normalizeName === name.toLowerCase(),
        );

        const newContact = {
            id: shortid.generate(),
            name,
            number,
        };

        if (checkedName) {
            return alert(
                `This contact "${name.toUpperCase()}" has already been added to your Phonebook`,
            );
        }

        this.setState(prevState => ({
            contacts: [newContact, ...prevState.contacts],
        }));
    };

    changeFilter = e => {
        this.setState({
            filter: e.currentTarget.value,
        });
    };

    findContact = () => {
        const { filter, contacts } = this.state;
        const normalizeFilter = filter.toLowerCase();
        // сделать условие что контакта нет если фильтр не нашел
        return contacts.filter(contact =>
            contact.name.toLowerCase().includes(normalizeFilter),
        );
    };

    onDelete = idContact => {
        this.setState(prevState => ({
            contacts: prevState.contacts.filter(({ id }) => id !== idContact),
        }));
    };

    render() {
        const { addContact, changeFilter, findContact, onDelete } = this;
        const { contacts, filter } = this.state;

        return (
            <Container>
                <Heading title={'Phonebook'} />
                <ContactForm onSubmit={addContact} />
                <Heading title={'Contacts'} />
                {contacts.length >= 2 && (
                    <Filter value={filter} onChange={changeFilter} />
                )}

                {contacts.length > 0 ? (
                    <ContactList
                        contactsArr={findContact()}
                        deleteContact={onDelete}
                    />
                ) : (
                    <Notification />
                )}
            </Container>
        );
    }
}

export default App;
