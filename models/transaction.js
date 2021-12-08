const sequelize = require('../db');
const {DataTypes} = require('sequelize');
const Transaction = sequelize.define('Transaction_Data', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    transaction_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    currency_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    transaction_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
}, {
    timestamps: true,
    freezeTableName: true
});

(async () => {
    await Transaction.sync();
})();

module.exports = Transaction;