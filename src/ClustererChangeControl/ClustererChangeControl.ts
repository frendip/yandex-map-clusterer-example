import {YMapComplexEntity, useDomContext} from 'ymaps3';
import './ClustererChangeControl.scss';

// Creating a custom control class for cluster management
interface ClustererChangeControlProps {
  toggleClusterer: () => void;
  changePointsCount: (count: number) => void;
  updatePoints: () => void;
}

export class ClustererChangeControl extends YMapComplexEntity<ClustererChangeControlProps> {
  private _element: HTMLDivElement;
  private _detachDom: () => void;
  constructor(props) {
    super(props);
    this._element = this._createElement(props);
  }

  _createElement(props: ClustererChangeControlProps) {
    const {toggleClusterer, changePointsCount, updatePoints} = props;

    const clustererChange = document.createElement('div');
    clustererChange.classList.add('clusterer-change');

    const inputSection = document.createElement('div');
    inputSection.classList.add('clusterer-change__section');

    const inputLabel = document.createElement('div');
    inputLabel.classList.add('clusterer-change__input__label');
    inputLabel.textContent = 'Point count:';
    inputSection.appendChild(inputLabel);

    const inputField = document.createElement('input');
    inputField.type = 'number';
    inputField.classList.add('clusterer-change__input');
    inputField.value = '100';
    inputField.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      changePointsCount(+target.value);
    });
    inputSection.appendChild(inputField);

    const btnSection = document.createElement('div');
    btnSection.classList.add('clusterer-change__section');

    const updatePointsBtn = document.createElement('button');
    updatePointsBtn.type = 'button';
    updatePointsBtn.classList.add('clusterer-change__btn');
    updatePointsBtn.textContent = 'Update points';
    updatePointsBtn.addEventListener('click', updatePoints);
    btnSection.appendChild(updatePointsBtn);

    const toggleClustererBtn = document.createElement('button');
    toggleClustererBtn.type = 'button';
    toggleClustererBtn.classList.add('clusterer-change__btn');
    toggleClustererBtn.textContent = 'Delete/Add Clusterer';
    toggleClustererBtn.addEventListener('click', toggleClusterer);
    btnSection.appendChild(toggleClustererBtn);

    clustererChange.appendChild(inputSection);
    clustererChange.appendChild(btnSection);

    return clustererChange;
  }
  _onAttach() {
    this._detachDom = useDomContext(this, this._element, this._element);
  }

  _onDetach() {
    this._detachDom();
    this._detachDom = null;
    this._element = null;
  }
}
