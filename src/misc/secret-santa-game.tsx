import * as React from "react";

import { shuffleList } from "../utils/list-helpers";

interface Guest {
  name: string;
  cannotGiftTo: string[];
}

interface GiftAssignment {
  from: string;
  to: string;
}

interface SecretSantaState {
  giftAssignment: GiftAssignment[];
}

export class SecretSantaGame extends React.Component<{}, SecretSantaState>
{
  public state = { giftAssignment: [] as GiftAssignment[] };
  private guests: Guest[] = [];

  public componentDidMount() {
    // ALL GUESTS
    this.addCouple('Jeanne', 'Maxime');
    this.addCouple('Anne', 'Alex');
    this.addCouple('Claire', 'Cédric');
    this.addCouple('Thérèse', 'Vincent');
    this.addCouple('Jean-Emmanuel', 'Emilie');
    this.addCouple('Bernie', 'Léo');
    this.addCouple('Agnès', 'Adrien');
    this.addCouple('Elisabeth', 'Alban');

    // INCOMPATIBILITIES
    this.addIncompatibility('Agnès', 'Thérèse');
    this.addIncompatibility('Agnès', 'Vincent');
    this.addIncompatibility('Adrien', 'Thérèse');
    this.addIncompatibility('Adrien', 'Vincent');
    this.addIncompatibility('Elisabeth', 'Thérèse');
    this.addIncompatibility('Elisabeth', 'Vincent');
    this.addIncompatibility('Alban', 'Thérèse');
    this.addIncompatibility('Alban', 'Vincent');

    // COMPUTE
    this.computeGifts();
  }

  public render = () => {
    const { giftAssignment } = this.state;

    if (giftAssignment.length === 0) {
      return null;
    }

    return (
      <div>
        <ul>
          {giftAssignment.map(a => (<li>{`${a.from} offre un cadeau à ${a.to}`}</li>))}
        </ul>
      </div>
    );
  }

  private addCouple = (name1: string, name2: string): void => {
    this.guests.push({
      name: name1,
      cannotGiftTo: [ name2 ],
    });
    this.guests.push({
      name: name2,
      cannotGiftTo: [ name1 ],
    });
  }

  private addIncompatibility = (name1: string, name2: string): void => {
    const guest1 = this.getGuest(name1);
    const guest2 = this.getGuest(name2);
    guest1.cannotGiftTo.push(name2);
    guest2.cannotGiftTo.push(name1);
  }

  private computeGifts = (): void => {
    const guestNames = this.guests.map(g => g.name);
    let giftAssignment: GiftAssignment[];
    do {
      shuffleList(guestNames);
      giftAssignment = this.getAssignment(guestNames);
    } while (!this.isValidAssignment(giftAssignment));
    this.setState({ giftAssignment });
  }

  private getAssignment = (guestNames: string[]): GiftAssignment[] => {
    const assignment: GiftAssignment[] = [];
    let lastName = guestNames[guestNames.length - 1];
    for (let i = 0; i < guestNames.length; i++) {
      const name = guestNames[i];
      assignment.push({ from: lastName, to: name });
      lastName = name;
    }
    return assignment;
  }

  private isValidAssignment = (giftAssignment: GiftAssignment[]): boolean => {
    for (let i = 0; i < giftAssignment.length; i++) {
      const guest = this.getGuest(giftAssignment[i].from);
      if (guest.cannotGiftTo.includes(giftAssignment[i].to)) {
        return false;
      }
    }
    return true;
  }

  private getGuest = (name: string): Guest => {
    const guest = this.guests.find(g => g.name === name);
    if (!guest) {
      throw new Error(`Cannot find name ${guest}`);
    }

    return guest;
  }
}
