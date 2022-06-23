import { sleep } from '../utils';

const navigation = {
  async myRestaurants() {
    const myRestaurants = document.querySelector('a[href="/restaurants"');

    await this.handleMenuNavigation(myRestaurants);
  },

  async myCharacters() {
    const myCharacters = document.querySelector('a[href="/characters"');

    await this.handleMenuNavigation(myCharacters);
  },

  async openCookModal(characterId: string) {
    await this.myCharacters();

    const characterBtnList: HTMLElement[] = Array.from(
      document.querySelectorAll('.character-buttons')
    );

    const cookBtnByCharId = characterBtnList.find((btnPair) =>
      (btnPair.children[1] as HTMLAnchorElement)?.href.includes(characterId)
    )?.children[0];

    if (cookBtnByCharId) {
      (cookBtnByCharId as HTMLElement).click();
      await sleep(4000);
    }
  },

  async closeModal() {
    const closeModalBtn = document.querySelector('.modal-close')?.children[0];

    if (closeModalBtn) {
      (closeModalBtn as HTMLElement).click();
      await sleep(1000);
    }
  },

  async handleMenuNavigation(domElement: Element | null) {
    if (!domElement) return;
    (domElement as HTMLElement).click();
    await sleep(2000);
  },
};

export default navigation;
