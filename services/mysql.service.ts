const numerics = [
  "tinyint",
  "smallint",
  "mediumint",
  "int",
  "bigint",
  "decimal",
  "float",
  "double",
  "real",
  "bit",
  "boolean",
  "serial",
] as const;
type MysqlTypeNumerics = typeof numerics[number];
const dates = [
  "date",
  "datetime",
  "timestamp",
  "time",
  "year",
] as const;
type MysqlTypeDates = typeof dates[number];
const strings = [
  "char",
  "varchar",
  "tinytext",
  "text",
  "mediumtext",
  "longtext",
  "binary",
  "varbinary",
  "tinyblob",
  "blob",
  "mediumblob",
  "longblob",
  "enum",
  "set",
] as const;
type MysqlTypeStrings = typeof strings[number];
const spatials = [
  "geometry",
  "point",
  "linestring",
  "polygon",
  "multipoint",
  "multilinestring",
  "multipolygon",
  "geometrycollection",
] as const;
type MysqlTypeSpatials = typeof spatials[number];
const others = [
  "json"
] as const;
type MysqlTypeOthers = typeof others[number];

const MysqlColumnTypes = [...numerics, ...dates, ...strings,...spatials,...others] as const;
type MysqlTypeTypes = typeof MysqlColumnTypes[number];

const _typeGroups = {
  numerics,
  strings,
  dates,
  spatials,
  others
} as const;
const MysqlColumnGroupTypes = Object.entries(_typeGroups)
  .map(([name, values]) => ({ name, values }));

const MysqlColumnGroupTypesDefault = ["int", "varchar", "datetime", "json", "blob"] as const;

const MysqlColumnAttributs = [
  "none",
  "binary",
  "unsigned"
] as const;
type MysqlTypeAttributs = typeof MysqlColumnAttributs[number];

const MysqlColumnIndexes = [
  "none",
  "primary",
  "unique",
  "index",
  "fulltext",
  "spatial"
] as const;
type MysqlTypeIndexes = typeof MysqlColumnIndexes[number];

type TableType = {
  uid: string;
  name: string;
  color: string;
  key: string;
  relations: RelationType[];
  columns: ColumnType[];
}

type ColumnType = {
  uid: string;
  name: string;
  length: string;
  default: string;
  type: MysqlTypeTypes;
  index: MysqlTypeIndexes;
  nullable: boolean;
  autoincrement: boolean;
  attribut?: MysqlTypeAttributs;
}

type RelationType = {
  uid: string;
  tableId: string;
  table: string;
  name: string;
}

const LineSpacing = ',\n        ';

function GenerateDatabase(tables: TableType[]): string {
  const content: string[] = [];

  //Sort tables with no relations to many relations
  const orderedTables = tables.sort((a,b) => {
    return a.relations.length - b.relations.length;
  })

  orderedTables.forEach((table, index) => {
    content.push(GenerateTable(table, index));
  })

  return content.join('\n');
}

function GenerateTable(table: TableType, index: number): string {

  const keys = GenerateKeys(table);
  const constraints = GenerateConstraints(table, index);

  return (`
    CREATE TABLE \`${table.name}\` (
        ${keys}${constraints != "" ? ", " : ""}
        ${constraints}
    )
    ENGINE=InnoDB;
  `)
}

function GenerateKeys(table: TableType): string {
  const columns = table.columns.map(tab => GenerateColumn(tab)).join(LineSpacing);
  const relations = table.relations.map(rel => GenerateRelationKey(rel)).join(LineSpacing);

  if(columns.length > 0 && relations.length > 0) return [columns, relations].join(LineSpacing)
  if(columns.length > 0 && relations.length <= 0) return columns;
  return relations;
}

function GenerateColumn(column: ColumnType): string {
  const { name, type, length, nullable, default: defaultValue, autoincrement, attribut } = column;
  const nullString = nullable ? " NULL" : " NOT NULL";
  const defaultString = defaultValue ? ` DEFAULT ${defaultValue}` : "";
  const autoincrementString = autoincrement ? " AUTO_INCREMENT" : "";
  const attributString = attribut ? " "+attribut.toUpperCase() : "";
  const lengthString = length ? ` (${length})` : "";

  return `\`${name}\` ${type}${lengthString}${nullString}${defaultString}${autoincrementString}${attributString}`;
}

function GenerateConstraints(table: TableType, idx: number): string {
  //Récupère les clés primaires des colonnes & relations
  const primaryKeys: string[] = [];
  primaryKeys.push(...table.columns.filter(col => col.index === "primary").map(col => `\`${col.name}\``));

  //Récupère toutes les relations sous forme de string (ajouter directement en primary key)
  const relations = table.relations.map(rel => NameRelationKey(rel));
  if(primaryKeys.length <= 0) {
    primaryKeys.push(...relations);
  }

  //Récupère toutes les autres contraintes des colonnes (hors primaire)
  const others = table.columns.filter(col => col.index !== "none" && col.index !== "primary");

  const content: string[] = [];
  if(primaryKeys.length > 0) {
    content.push(`CONSTRAINT \`PK_${table.name}\` PRIMARY KEY (${primaryKeys.join(', ')})`);
  }

  if(others.length > 0) {
    content.push(...GenerateIndexes(others, idx));
  }

  if(relations.length > 0) {
    content.push(...GenerateRelations(table.relations, idx))
  }

  return content.join(LineSpacing);
}

function NameRelationKey(rel: RelationType): string {
  return `\`${rel.table}_${rel.name}\``
}

function GenerateIndexes(columns: ColumnType[], idx: number) {
  return columns
    .map(col => {
      const {name, index} = col;
      const prefix = index === 'index' ? 'Idx' : index === 'unique' ? 'Unq' : 'K';
      return `CONSTRAINT \`${prefix}_${name}${idx}\` ${index.toUpperCase()} (\`${name}\`)`
    });
}

function GenerateRelationKey(relation: RelationType): string {
  const { table, name } = relation;

  const key = table + "_" + name;

  return `\`${key}\` INT NOT NULL`;
}

function GenerateRelations(relations: RelationType[], idx: number): string[] {
  return relations.map(rel => `CONSTRAINT \`FK_Relation_${rel.table}${idx}\` FOREIGN KEY (\`${rel.table}_${rel.name}\`) REFERENCES \`${rel.table}\`(\`${rel.name}\`)`)
}

export {
  MysqlColumnTypes,
  MysqlColumnGroupTypes,
  MysqlColumnAttributs,
  MysqlColumnIndexes,
  MysqlColumnGroupTypesDefault,
  GenerateDatabase,
};

export type {
  MysqlTypeDates,
  MysqlTypeNumerics,
  MysqlTypeStrings,
  MysqlTypeOthers,
  MysqlTypeSpatials,
  MysqlTypeTypes,
  MysqlTypeIndexes,
  MysqlTypeAttributs,
  ColumnType,
  TableType,
  RelationType
}


