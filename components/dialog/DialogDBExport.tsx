"use client"

import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import React, {useContext, useEffect, useState} from "react";
import {TypographyH1, TypographyH4, TypographySmall} from "@/components/ui/text";
import {Button} from "@/components/ui/button";
import {DiMysql} from "react-icons/di";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {TableContext} from "@/contexts/table.context";
import {GenerateDatabase} from "@/services/mysql.service";

export const DialogDBExport: React.FC<React.PropsWithChildren> = ({children}) => {

  const tableCtx = useContext(TableContext);
  const [open, setOpen] = useState(false);
  const [generated, setGenerated] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const handleGenerateExport = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    setGenerated(GenerateDatabase(tableCtx.tables))
  }

  const handleCopyClipboard = () => {
    if(generated) {
      navigator.clipboard.writeText(generated)
      .then(r => setCopied(true))
      .catch(r => setCopied(false))
      setTimeout(() => {
        setCopied(false);
      }, 2500)
    }
  }

  useEffect(() => {
    if(!open) {
      setGenerated("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        {
          !generated ? (
            <>
              <DialogHeader>
                <DialogTitle>
                  <TypographyH1>Exporter votre schéma</TypographyH1>
                </DialogTitle>
                <DialogDescription>
                  Choisissez un ou plusieurs moyen d'exporter votre database.
                </DialogDescription>
              </DialogHeader>
              <div>
                <RadioGroup defaultValue={'mysql'} className={'grid grid-cols-3 gap-4 my-4'}>
                  <div>
                    <RadioGroupItem value={"mysql"} id={"mysql"} className={'peer sr-only'}/>
                    <Label
                      htmlFor={'mysql'}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                      <DiMysql size={32}/>
                      <TypographyH4>MySQL</TypographyH4>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value={"postgresql"} id={"postgresql"} className={'peer sr-only'}/>
                    <Label
                      htmlFor={'postgresql'}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                      <DiMysql size={32}/>
                      <TypographyH4>PostgreSQL</TypographyH4>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant={'outline'}>Fermer</Button>
                </DialogClose>
                <Button onClick={handleGenerateExport}>Exporter</Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Voici votre export</DialogTitle>
              </DialogHeader>
              <div className={'h-96 overflow-y-scroll my-8'}>
                <pre className={'bg-stone-200'}>
                  <code className={'language-sql'}>
                     {generated}
                  </code>
                </pre>
              </div>
              <Button onClick={handleCopyClipboard}>Copier</Button>
              {
                copied && <TypographySmall className={'ml-2 text-green-400'}>Copier dans le presse-papier !</TypographySmall>
              }
            </>
          )
        }

      </DialogContent>
    </Dialog>
  );
};
