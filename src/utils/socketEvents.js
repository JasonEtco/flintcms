export default class SocketEvents {
  constructor(socket, dispatch) {
    this.dispatch = dispatch;
    this.socket = socket;
  }

  newEntry() {
    this.socket.on('new-entry', savedEntry => console.log(savedEntry));
  }

  deleteEntry() {
    this.socket.on('delete-entry', deletedId => console.log(deletedId));
  }

  newSection() {
    this.socket.on('new-section', savedSection => console.log(savedSection));
  }

  deleteSection() {
    this.socket.on('delete-section', deletedId => console.log(deletedId));
  }

  listen() {
    this.newEntry();
    this.deleteEntry();
    this.newSection();
    this.deleteSection();
  }
}
