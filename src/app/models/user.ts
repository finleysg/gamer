export class Member {
  id: number;
  ghin: string;
  handicap: number;
  canEdit: boolean;

  fromJson(json: any): Member {
    if (json) {
      this.id = json.id;
      this.ghin = json.ghin;
      this.handicap = json.handicap || 0.0;
      this.canEdit = json.can_edit;
    }
    return this;
  }

  toJson(): any {
    return {
      'id': this.id,
      'ghin': this.ghin,
      'handicap': this.handicap
    };
  }
}

export class PublicMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  ghin: string;
  handicap: number;

  get name(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  fromJson(json: any): PublicMember {
    this.id = json.id;
    this.firstName = json.first_name;
    this.lastName = json.last_name;
    this.email = json.email;
    this.ghin = json.ghin;
    this.handicap = json.handicap || 0.0;
    return this;
  }
}

export class User {

  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  member: Member;
  isAuthenticated = false;
  isStaff = false;
  isActive = false;

  constructor() {
    this.member = new Member();
  }

  get name(): string {
    if (!this.isAuthenticated) {
      return 'Guest';
    }
    return this.firstName + ' ' + this.lastName;
  }

  fromJson(json: any): User {
    if (json) {
      this.id = json.id;
      this.username = json.username;
      this.firstName = json.first_name;
      this.lastName = json.last_name;
      this.email = json.email;
      this.isAuthenticated = json.is_authenticated;
      this.isStaff = json.is_staff;
      this.isActive = json.is_active;
      this.member = new Member().fromJson(json.member);
    }
    return this;
  }

  // used only to create new accounts
  toJson(password: string): any {
    return {
      'username': this.username,
      'email': this.email,
      'password': password,
      'first_name': this.firstName,
      'last_name': this.lastName,
      'groups': [],
      'member': this.member.toJson()
    };
  }

  // partialUpdateJson(updateType: AccountUpdateType): any {
  //     switch (updateType) {
  //         case AccountUpdateType.PersonalInfo:
  //             return {
  //                 'first_name': this.firstName,
  //                 'last_name': this.lastName,
  //                 'member': {
  //                     'birth_date': this.member.birthDate ? this.member.birthDate.format('YYYY-MM-DD') : null,
  //                     'address1': this.member.address,
  //                     'city': this.member.city,
  //                     'state': this.member.state,
  //                     'zip': this.member.zipCode
  //                 }
  //             };
  //         case AccountUpdateType.ContactInfo:
  //             return {
  //                 'email': this.email,
  //                 'member': {
  //                     'phone_number': this.member.phoneNumber
  //                 }
  //             };
  //         case AccountUpdateType.Username:
  //             return {
  //                 'username': this.username,
  //                 'member': { }
  //             };
  //         case AccountUpdateType.ForwardTees:
  //             return {
  //                 'member': {
  //                     'forward_tees': this.member.forwardTees
  //                 }
  //             };
  //         case AccountUpdateType.PaymentInfo:
  //             return {
  //                 'member': {
  //                     'save_last_card': this.member.saveLastCard
  //                 }
  //             };
  //         default:
  //             return {};
  //     }
  // }
}
