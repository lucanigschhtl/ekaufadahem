
//Muss auf dem Server mitgeändert werden


export class TypeConverter {
   static OrderStatusTypes = {
        REJECTED:0,
        NEW:1,
        READYFORPICKING:2,
        READYTOTAKE:3,
        FINISHED:4,
       
      };
  
      static OrderStatusTypesInfo = {
        [TypeConverter.OrderStatusTypes.NEW]: {
          color: 'primary',
          title:"Neu",
          rank:3
        },
        [TypeConverter.OrderStatusTypes.READYFORPICKING]: {
          color: 'secondary',
          title:"Bereit zum Zusammenrichten",
          rank:2
        },
        [TypeConverter.OrderStatusTypes.READYTOTAKE]: {
          color: 'success',
          title:"Bereit zur Abholung",
          rank:1
        },
        [TypeConverter.OrderStatusTypes.FINISHED]: {
          color: 'secondary',
          title:"Erledigt",
          rank:4
        },
        [TypeConverter.OrderStatusTypes.REJECTED]: {
          color: 'danger',
          title:"Abgelehnt",
          rank:5
        }
      };

    
  
    static getOrderStatusTypeDetailsById(statusId) {
      return TypeConverter.OrderStatusTypesInfo[statusId];
    }

    static OrderPickupTypes = {
      PICKUP:0,
      BOX:1,
      DELIVERY:2,
    };

    static OrderPickupTypesInfo = {
      [TypeConverter.OrderPickupTypes.PICKUP]: {
        color: 'primary',
        title:"Abholung im Laden"
      },
      [TypeConverter.OrderPickupTypes.BOX]: {
        color: 'secondary',
        title:"Abholschrank"
      },
      [TypeConverter.OrderPickupTypes.DELIVERY]: {
        color: 'secondary',
        title:"Lieferung"
      }
      
    };
    static getOrderPickupTypeDetailById(statusId) {
      return TypeConverter.OrderPickupTypesInfo[statusId];
    }

    static PaymentTypes = {
      BAR:0,
      LASTSCHRIFT:1,
      RECHNUNG:2,
    };

    static PaymentTypesInfo = {
      [TypeConverter.PaymentTypes.BAR]: {
        color: 'primary',
        title:"Bezahlung bei Abholung"
      },
      [TypeConverter.PaymentTypes.LASTSCHRIFT]: {
        color: 'primary',
        title:"Abbuchung per Lastschrift"
      },
      [TypeConverter.PaymentTypes.RECHNUNG]: {
        color: 'primary',
        title:'Rechnung'
      } 
      
    };

    static getPaymentTypeDetailById(statusId){
      return TypeConverter.PaymentTypesInfo[statusId];
    }
  }
  