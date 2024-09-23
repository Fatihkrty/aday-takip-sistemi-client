import Home from '@mui/icons-material/Home';
import Work from '@mui/icons-material/Work';
import Radar from '@mui/icons-material/Radar';
import NoteAdd from '@mui/icons-material/NoteAdd';
import HowToReg from '@mui/icons-material/HowToReg';
import { UserRoles } from '@/constants/user-roles.enum';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import EditLocation from '@mui/icons-material/EditLocation';
import EngineeringIcon from '@mui/icons-material/Engineering';
import AttachEmailIcon from '@mui/icons-material/AttachEmail';

export interface ISidePanelMenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  role?: UserRoles;
}

export interface ISidePanelMenu {
  subheader?: string;
  items: ISidePanelMenuItem[];
}

export const DRAWER_WIDTH = 280;

export const DRAWER_MENU: ISidePanelMenu[] = [
  {
    subheader: 'Anasayfa',
    items: [
      {
        name: 'Anasayfa',
        path: '/',
        icon: <Home />,
      },
    ],
  },
  {
    subheader: 'İşlemler',
    items: [
      {
        name: 'Firmalar',
        path: '/firmalar',
        icon: <NewspaperIcon />,
      },
      {
        name: 'Firma Talepleri',
        path: '/talepler',
        icon: <NoteAdd />,
      },
      {
        name: 'Adaylar',
        path: '/adaylar',
        icon: <PeopleAltIcon />,
      },
      {
        name: 'Yönlendirme Geçmişi',
        path: '/adaylar/yonlendirilen-adaylar',
        icon: <HowToReg />,
      },
    ],
  },
  {
    subheader: 'Yönetim',
    items: [
      {
        name: 'Kullanıcılar',
        path: '/kullanicilar',
        icon: <EngineeringIcon />,
      },
      {
        name: 'Dış Firma Talepleri',
        path: '/talepler/dis-firma-talepleri',
        icon: <AttachEmailIcon />,
      },
    ],
  },
  {
    subheader: 'Otomatik Tamamlamalar',
    items: [
      {
        name: 'Pozisyonlar',
        path: '/otomatik-tamamlamalar/pozisyonlar',
        icon: <Radar />,
      },
      {
        name: 'Lokasyonlar',
        path: '/otomatik-tamamlamalar/lokasyonlar',
        icon: <EditLocation />,
      },

      {
        name: 'Sektörler',
        path: '/otomatik-tamamlamalar/sektor',
        icon: <Work />,
      },
    ],
  },
];
